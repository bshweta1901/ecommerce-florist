from functools import wraps

from flask import current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.orm import joinedload

from app.extensions import cache, session_scope
from app.main.user.model.user import User


def get_id_by_uuid(uuid, model, model_with_id_field, session):
    """A utility function that retrieves the id of a record based on its uuid from a given model"""
    try:
        with session:
            # Query to fetch the id using the uuid
            id = session.query(model_with_id_field).filter(
                model.uuid == uuid, model.is_delete == False).scalar()

            # If the ID is not found, return an error message
            if not id:
                return {"message": f"{uuid} of {model.__name__} not found"}, 400

            # Return the found ID
            return id

    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.exception(e)
        return {"message": str(e)}, 500


def set_id_if_exists_in_dict(uuid, model, model_with_id_field, model_data, package_data_key, session):
    """Retrieve the ID from a UUID and update the provided dictionary with the result."""

    id_result = get_id_by_uuid(uuid, model, model_with_id_field, session)
    if not isinstance(id_result, int):
        return id_result
    if isinstance(id_result, int):
        model_data[package_data_key] = id_result
        return True
    return {"message": "Unexpected response from get_id_by_uuid"}, 500


def map_uuids_to_ids(data_dict, field_mappings, mapped_dict, session):
    for field, model, model_id_field, id_field in field_mappings:
        if data_dict.get(field):
            result = set_id_if_exists_in_dict(
                data_dict[field], model, model_id_field, mapped_dict, id_field, session)
            if result is not True:
                return result
            data_dict.pop(field)
    return True


@cache.memoize(timeout=3600)  # Cache result for the function
def is_admin_cached(user_uuid):
    """Check if the user has the 'ADMIN' role and cache the result."""
    with session_scope() as session:
        user = session.query(User).filter(
            User.uuid == user_uuid,
            User.is_delete == False
        ).options(
            joinedload(User.roles)
        ).first()

        if not user:
            return False  # Cache False for non-existent users

        # Return True if the user has the 'ADMIN' role
        return any(role.code.upper() == 'ADMIN' for role in user.roles)


def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_uuid = get_jwt_identity()
        if not is_admin_cached(user_uuid):
            return {"message": "Unauthorized access"}, 403

        return func(*args, **kwargs)
    return wrapper
