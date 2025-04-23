from datetime import timedelta

from flask import current_app, jsonify, session
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from flask_restx import marshal

from app.extensions import session_scope
from app.main.exceptation.custom_exception import CustomException
from app.main.user.model.user import User
from app.main.user.util.user_dto import UserDto

from ...user.model.user_otp import UserOtp


def login_user(data):
    try:
        email = data.get("email")
        username = data.get("username")
        with session_scope() as session:
            if email:
                user = (
                    session.query(User)
                    .filter(User.email == email, User.is_delete == False)
                    .first()
                )
            elif username:
                user = (
                    session.query(User)
                    .filter(User.username == username, User.is_delete == False)
                    .first()
                )
            else:
                return {"message": "Email or username is required"}, 400

            if not user:
                return {"message": "User does not exists."}, 400
            elif user.is_active == False:
                return {
                    "message": "Your account has been deactivated,please contact admin"
                }, 400

            auth_config = user.get_auth_config(session)

            if auth_config.auth_type == "OTP":
                user_otp = UserOtp(email=data.get("email"), otp=data.get("otp"))
                is_verified = user_otp.verify_otp(user_otp.email, user_otp.otp)
                if is_verified:
                    if auth_config.is_admin:
                        return generate_token(user, session)
            if auth_config.auth_type == "PASSWORD":
                if user.check_password(data.get("password")):
                    if auth_config.is_admin:
                        return generate_token(user, session)

            return {"message": "Invalid username or password"}, 400
    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def generate_token(user, session, is_new_user=None):
    access_token_expires = timedelta(days=2)
    access_token = create_access_token(
        identity=str(user.id), expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(identity=str(user.id))
    roles_data = [
        {"id": role.id, "name": role.name, "code": role.code} for role in user.roles
    ]
    with session:
        response_object = {
            "message": "Logged In",
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": user.id,
                    "uuid": user.uuid,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "roles": roles_data,
                },
            },
        }
        return response_object, 200


def refresh_access(refresh_token):
    try:
        decoded_token = decode_token(refresh_token)
        access_token = create_access_token(
            identity=decoded_token["sub"], expires_delta=timedelta(days=2)
        )
        user_uuid = decoded_token["sub"]
        return jsonify(
            {
                "access_token": new_access_toknen,
                "refresh_token": refresh_token,
                "user": {
                    # "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.full_name,
                    "roles": roles_data,
                },
            }
        )

        # with session_scope() as session:
        #     user = session.query(User).filter(
        #         User.uuid == user_uuid, User.is_delete == False).first()

        #     user_res = marshal(user, UserDto.get_user_dto)

        #     response_object = {
        #         "message": "Logged In",
        #         "data": {
        #             "access_token": access_token,
        #             "refresh_token": refresh_token,
        #             "user": user_res
        #         },
        #     }
        #     return response_object, 200

    except Exception as e:
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)
