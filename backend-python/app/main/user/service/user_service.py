from sqlalchemy.orm import aliased
import asyncio
import datetime
import os
import threading

import requests
from flask import abort, current_app, render_template
from flask_jwt_extended import create_access_token, decode_token
from flask_mail import Message  # Assuming you have a config module
from flask_mail import Mail
from flask_restx import marshal
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import and_, func, literal, or_, case
from sqlalchemy.orm import joinedload, column_property

from app.extensions import db, session_scope
from app.main.exceptation.custom_exception import CustomException
from app.main.user.Constants import auth_constant
from app.main.user.model.role import user_roles
from app.main.user.model.user import User
from app.main.user.util.user_dto import UserDto
from app.main.utils.model.common_model import indian_time_now
from app.main.utils.model.predefined_master import PredefinedMaster
from app.main.utils.service import common_communication as communication
from app.main.utils.service.utility import set_object_id_exists
from app.main.utils.utility import set_id_if_exists_in_dict

from ...auth.model.auth_config import AuthConfig
from ...utils.model.document_master import DocumentMaster
from ...utils.service.document_service import (
    delete_old_image,
    get_file_type,
    save_document,
    save_multipart_file_and_get_path,
    upload_document,
    validate_file_format,
)
from ..Constants.login_constants import (
    ALL,
    EMAIL,
    EMAIL_AND_PHONE,
    PHONE,
    PHONE_AND_USERNAME,
    USERNAME,
)
from ..Constants.role_constants import ROLE_ADMIN, ROLE_CUSTOMER, ROLE_STAFF
from ..model.role import Role
from ..model.user import user_roles
from ..model.user_otp import UserOtp
from .role_service import get_role_by_code
from typing import List, Any

from app.main.user.model import role


def create_entity(data, image):
    with session_scope() as session:
        try:
            roles = data.get("roles")
            if roles:
                roles = data.pop("roles", None)

            auth_config = AuthConfig.get_auth_config_by_roles(roles, session)
            if auth_config is None:
                raise CustomException(
                    status_code=400, message=f"No Auth Config Present for roles {roles}"
                )

            data = auth_config_check(auth_config, data, session)

            # Create new user
            new_user = User(**data)
            session.add(new_user)
            session.flush()  # Ensures new_user.id is available

            if roles:
                role_objects = (
                    session.query(Role)
                    .filter(Role.code.in_(roles), Role.is_delete == False)
                    .all()
                )
                new_user.roles.extend(role_objects)

            if not new_user.roles:
                raise CustomException("Roles not Found", 401)

            # Upload Image if provided
            if image:
                document_master = upload_document(
                    image, "users", new_user.id, "PROFILE-IMAGE", session
                )
                if isinstance(document_master, DocumentMaster):
                    new_user.profile_img_id = document_master.id
                else:
                    return document_master

            update_user_access(new_user, session)
            session.commit()

            return {
                "message": "User Registered Successfully",
                "user_id": new_user.id,
            }, 201

        except CustomException as e:
            session.rollback()
            current_app.logger.exception(e)
            raise CustomException(status_code=400, message=e.message)

        except Exception as e:
            session.rollback()
            current_app.logger.exception(e)
            raise CustomException(status_code=500, message=str(e))


def update_user_access(user, session):
    try:
        user_id = user.id
        new_role_ids = user.roles_ids
        # Fetch current role_module_ids for the user from access_control where is_delete is False
        current_access = (
            session.query(AccessControl.role_module_id)
            .filter_by(user_id=user_id, is_delete=False)
            .all()
        )
        current_access_ids = {access.role_module_id for access in current_access}

        # Fetch the role_module_ids associated with the new roles
        new_role_module_ids = (
            session.query(RoleModule.id)
            .filter(RoleModule.role_id.in_(new_role_ids))
            .all()
        )
        new_role_module_ids = {role_module.id for role_module in new_role_module_ids}

        # Find role_module_ids to add (new entries that aren't in current access)
        role_module_ids_to_add = new_role_module_ids - current_access_ids

        # Find role_module_ids to soft delete (current access that isn't in new roles)
        role_module_ids_to_soft_delete = current_access_ids - new_role_module_ids

        # Add new access_control entries
        if role_module_ids_to_add:
            for role_module_id in role_module_ids_to_add:
                access = AccessControl(
                    user_id=user_id,
                    role_module_id=role_module_id,
                    is_delete=False,
                )
                user.access_controls.append(access)

        # Soft delete old access_modules by setting is_delete=True
        if role_module_ids_to_soft_delete:
            session.query(AccessControl).filter(
                AccessControl.user_id == user_id,
                AccessControl.role_module_id.in_(role_module_ids_to_soft_delete),
            ).update({"is_delete": True}, synchronize_session=False)

        # Commit changes
        session.commit()
    except Exception as e:
        raise CustomException(str(e), 500)


def auth_config_check(auth_config, user, session):
    try:
        auth_field = auth_config.username_field
        email = user.get("email", user.get("username", None))
        phone = user.get("phone", user.get("username", None))
        username = user.get("username", None)
        #
        if auth_field == EMAIL:
            validate_username(email, "email", session)
            user.setdefault("username", email)
            user.setdefault("email", email)
        elif auth_field == PHONE:
            validate_username(phone, "phone", session)
            user.setdefault("username", phone)
            user.setdefault("phone", phone)
        elif auth_field == EMAIL_AND_PHONE:
            validate_username(phone, "phone", session)
            validate_username(email, "email", session)
            user.setdefault("username", email)
        elif auth_field == PHONE_AND_USERNAME:
            validate_username(phone, "phone", session)
            validate_username(username, "username", session)
        elif auth_field == USERNAME:
            validate_username(username, "username", session)
        elif auth_field == ALL:
            validate_username(email, "email", session)
            validate_username(phone, "phone", session),
            validate_username(username, "username", session)
        else:
            abort(400, "Invalid auth config: " + auth_field)
        return user
    except CustomException as e:
        raise CustomException(str(e), 400)
    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(
            f"An error occurred while validating usernam " + str(e), 500
        )


user_roles_alias = aliased(user_roles)
roles_alias = aliased(Role)
user_alias = aliased(User)


def get_all_entities(data):
    try:
        page = data.get("page_number", 1)
        size = data.get("page_size", 0)
        query = (
            db.session.query(user_alias)
            .filter_by(is_delete=False)
            .outerjoin(user_roles_alias, user_alias.id == user_roles_alias.c.user_id)
            .outerjoin(roles_alias, roles_alias.id == user_roles_alias.c.role_id)
        )

        query = query_criteria(query, data)
        query = query.order_by(user_alias.id.desc())
        total_records = query.count()  # Get total count before pagination
        # Apply pagination if page and size are valid
        if size is not None and size > 0:
            query = query.limit(size).offset((page - 1) * size)

        data_list = query.all()
        return {
            "data": data_list,
            "total": total_records,
            "page": page,
            "page_size": size,
            "total_pages": (total_records + max(size, 1) - 1) // max(size, 1),
        }
    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def query_criteria(query, data):
    search_by = data.get("search_by", None)
    is_active = data.get("is_active")
    role_code = data.get("code", None)
    role_id = data.get("role_id", None)
    gender_id = data.get("gender_id", None)
    city_id = data.get("city_id", None)
    referred_by_id = data.get("referred_by_id", None)
    player_type_id = data.get("player_type_id", None)
    is_staff = data.get("is_staff", False)
    is_admin = data.get("is_admin", False)

    if is_staff:
        query = query.filter(roles_alias.code == ROLE_STAFF)
    if is_admin:
        query = query.filter(roles_alias.code == ROLE_ADMIN)

    if role_id:
        query = query.filter(roles_alias.id == role_id)
    if gender_id:
        query = query.filter(user_alias.gender_id == gender_id)
    if city_id:
        query = query.filter(user_alias.city_id == city_id)
    if referred_by_id:
        query = query.filter(user_alias.referred_by_id == referred_by_id)
    if player_type_id:
        query = query.filter(user_alias.player_type_id == player_type_id)
    if search_by:
        query = query.filter(
            or_(
                user_alias.full_name.ilike(f"%{search_by}%"),
                user_alias.phone.ilike(f"%{search_by}%"),
            )
        )
    if role_code:
        query = query.filter(roles_alias.code == role_code)
    if is_active is not None:
        query = query.filter(user_alias.is_active == is_active)

    return query


def get_entity_by_id(id):
    try:
        user = (
            db.session.query(User)
            .filter(User.id == id, User.is_delete == False)
            .options(
                joinedload(
                    User.roles,
                ),
                joinedload(User.profile_img),
            )
            .first()
        )
        if not user:
            raise CustomException("User Not Found", 400)

        return user
    except CustomException as e:
        # Use e.message directly
        raise CustomException(e.message, e.status_code)
    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def change_status(id):
    try:
        user = get_entity_by_id(id)
        user.is_active = not user.is_active
        db.session.add(user)
        db.session.commit()
        res_msg = "activated" if user.is_active else "deactivated"
        return {"message": f"User {res_msg} successfully"}, 200

    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)
        # return {"message": "An error occurred while changing user status"}, 500


def soft_delete(id):
    try:
        user = get_entity_by_id(id)
        if not user:
            return {"message": "User not found"}, 400
        user.is_delete = True
        db.session.commit()
        return {"message": "User deleted successfully"}, 200
    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def get_user_by_username(username):
    query = User.query.filter(User.username == username, User.is_delete == False)
    user = query.first()
    return user


def update_entity(id, data):
    try:

        with session_scope() as session:
            user = User.query.filter_by(id=id).first()
            roles = data.pop("roles", None)
            username_update_fields = ["email", "phone", "username"]
            profiles = None
            if data.get("user_profile") is not None:
                profiles = data.pop("user_profile")

            for field in username_update_fields:
                new_value = data.get(field)
                if (
                    user.username == getattr(user, field)
                    and new_value
                    and new_value != getattr(user, field)
                ):
                    if get_user_by_username(new_value):
                        raise CustomException(
                            status_code=400,
                            message=f"User already exists with this {field}",
                        )
                    setattr(user, field, new_value)
                    user.username = new_value

            user = set_object_id_exists(user, User, data)

            if roles is not None:
                user.roles.clear()  # Remove all existing roles
                for code in roles:
                    role = get_role_by_code(code)
                    if role is not None:
                        user.roles.append(role)  # Add new roles

            # session.merge(user)
            session.flush()
            if roles:
                update_user_access(user, session)
            db.session.add(user)
            db.session.commit()
            response_object = {"message": "User successfully updated."}
        return response_object, 200

    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def validate_username(username, field_name, session, for_update=False, user_id=None):
    if not username:
        return {"message": f"{field_name} is required"}, 400

    user_field = getattr(User, field_name, None)
    if user_field is None:
        raise CustomException(f"Invalid field: {field_name}", 400)

    query = session.query(User).filter(user_field == username, User.is_delete == False)

    if for_update and user_id:
        query = query.filter(User.user_id != user_id)

    if query.first():
        raise CustomException(f"{field_name} already exists", 400)

    return {"message": "Success"}, 200


def upload_profile_doc(uuid, image):
    try:
        with session_scope() as session:
            user = session.query(User).filter(User.uuid == uuid).first()
            if not user:
                return {"message": "User not found"}, 400

            if image:
                if user.profile_img_id:
                    delete_old_image([user.profile_img_id], session)
                    user.profile_img_id = None
                document_master = upload_document(
                    image, "users", user.user_id, "PROFILE-IMAGE", session
                )
                if isinstance(document_master, DocumentMaster):
                    user.profile_img_id = document_master.id
                else:
                    return document_master
            session.add(user)
            session.commit()
            return {
                "message": "User profile picture updated successfully",
                "user_uuid": uuid,
            }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"An error occurred: {str(e)}")
        raise CustomException(str(e), 500)


def list_roles():
    try:
        with session_scope() as session:
            roles = session.query(Role).all()
            res = {"data": roles}
            return res, 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        raise CustomException(str(e), 500)


def get_user_from_access_token(access_token):
    try:
        user_uuid = decode_token(access_token)["sub"]
        with session_scope() as session:
            user = (
                session.query(User)
                .filter(User.uuid == user_uuid, User.is_delete == False)
                .first()
            )
            if user and user.is_active == False:
                return {"message": "User is deactivated, Please contact admin"}, 400
            user_res = marshal(user, UserDto.get_user_dto)
            return user_res, 200
    except Exception as e:
        raise CustomException(f"Token is invalid: {str(e)}", 500)


def send_otp(data):
    email = data.get("email")
    phone = data.get("phone")
    username = data.get("username")

    user = get_user_by_username(username)
    with session_scope() as session:
        if user:
            email = user.email
            phone = user.phones

        roles = data.get("roles", None)

        auth_config = AuthConfig.get_auth_config_by_roles([roles], session)

        if auth_config.auth_type != "OTP":
            raise CustomException(
                "Invalid authentication method used for this user.", 400
            )

        otp = UserOtp.random_with_N_digits(6)
        expiry_date_time = indian_time_now() + datetime.timedelta(minutes=10)
        UserOtp(username=username, otp=otp, expiry_date_time=expiry_date_time).save(
            session
        )

        otp_dict = {"otp": otp}
        email = email if email is not None else username
        phone = phone if phone is not None else username
        if (
            auth_config.otp_verification_on in {auth_constant.EMAIL, auth_constant.BOTH}
            and email
        ):
            email_content = render_template("otp.html", data=otp_dict)
            communication.send_func_in_bg(
                communication.send_mail,
                template_code="OTP Email",
                recipient=email,
                model=email_content,
            )

        if (
            auth_config.otp_verification_on in {auth_constant.SMS, auth_constant.BOTH}
            and phone
        ):
            communication.send_func_in_bg(
                communication.send_sms, phone=phone, model=otp_dict
            )

        return {"message": "OTP sent to user", "otp": otp}, 200


def verify_otp(data):
    from app.main.auth.service.auth_service import generate_token

    username = data.get("username")
    role = data.get("role")
    otp = data.get("otp")

    if not username or not otp:
        raise CustomException("Username and OTP are required.", 400)

    try:
        with session_scope() as session:
            # Fetch the OTP record
            user_otp = (
                session.query(UserOtp).filter_by(username=username, otp=otp).first()
            )
            if not user_otp:
                raise CustomException("Invalid OTP.", 400)

            # Verify OTP
            if not user_otp.verify_otp(session, username, otp):
                raise CustomException("OTP has expired.", 400)

            # Fetch or create user
            user = session.query(User).filter_by(username=username).first()
            is_new_user = False

            if not user:

                roles = data.get("roles", None)
                auth_config = AuthConfig.get_auth_config_by_roles([roles], session)
                if auth_config is None:
                    raise CustomException(
                        status_code=400,
                        message=f"No Auth Config Present for roles {roles}",
                    )

                user = auth_config_check(auth_config, data, session)
                user_role = get_role_by_code(roles)
                # create_entity({"username": username, "roles": [user_role]})
                user = User(
                    username=user.get("username"),
                    email=user.get("email"),
                    phone=user.get("phone"),
                    roles=[user_role],
                )
                db.session.add(user),
                db.session.commit()
                is_new_user = True

            return generate_token(user, session, is_new_user)
    except CustomException as e:
        current_app.logger.exception(e)
        raise CustomException(e.message, e.status_code)

    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(f"An error occurred while verifying OTP{str(e)}.", 500)
