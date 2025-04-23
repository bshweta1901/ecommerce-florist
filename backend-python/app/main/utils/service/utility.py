from flask import current_app, g
from sqlalchemy import inspect
from app.extensions import session_scope
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

import pytz
from datetime import datetime

from app.main.exceptation.custom_exception import CustomException
from app.extensions import db


def indian_time_now():
    tz = pytz.timezone("Asia/Kolkata")  # Indian timezone
    return datetime.now(tz)


def get_id_by_uuid(uuid, model):
    """A utility function that retrieves the id of a record based on its uuid from a given model"""
    try:
        with session_scope() as session:
            # Query to fetch the id using the uuid
            id = (
                session.query(model.id)
                .filter(model.uuid == uuid, model.is_delete == False)
                .scalar()
            )

            # If the ID is not found, return an error message
            if not id:
                raise CustomException(f"{model.__name__} ,{uuid} not found", 400)

            # Return the found ID
            return id

    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.exception(e)
        return {"error": str(e)}, 500


def get_single_value(query):
    """A utility function that retrieves the id of a record based on its uuid from a given model"""
    try:
        with session_scope() as session:
            # Query to fetch the id using the uuid
            name = query.scalar()

            # Return the found ID
            return name

    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.exception(e)
        return {"error": str(e)}, 500


def get_uuid_by_id(model, id):
    try:
        with session_scope() as session:
            uuid = (
                session.query(model.uuid)
                .filter(model.id == id, model.is_delete == False)
                .scalar()
            )
            return uuid
    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def get_id_by_uuid_object(data, model, name):
    """A utility function that retrieves the id of a record based on its uuid from a given model"""
    try:
        with session_scope() as session:
            obj = data.get(name)
            if obj is not None:
                if isinstance(obj, dict) and "uuid" in obj:
                    field_uuid = f"{name}_uuid"
                    id = None
                    if field_uuid != "":
                        # Query to fetch the id using the uuid
                        id = (
                            session.query(model.id)
                            .filter(model.uuid == obj["uuid"], model.is_delete == False)
                            .scalar()
                        )
                        data[field_uuid] = obj["uuid"]

                    # If the ID is not found, return an error message
                    if not id:
                        raise CustomException(
                            {"error": f"{model.__name__} ,{obj['uuid']} not found"}, 400
                        )

                    field = f"{name}_id"
                    data[field] = id

                    # Return the found ID
                    return data
                else:
                    return {"error": f"{model.__name__} ,{obj} not found"}, 400
            else:
                return data

    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.exception(e)
        raise CustomException(str(e), 500)


def set_id_if_exists_in_dict(field, uuid, model, model_data):
    """Retrieve the ID from a UUID and update the provided dictionary with the result."""
    if uuid is not None:
        id_result = get_id_by_uuid(uuid, model)
        if not isinstance(id_result, int):
            return id_result
        if isinstance(id_result, int):
            package_data_key = field.replace("uuid", "id")
            model_data[package_data_key] = id_result
            del model_data[field]
            return True
        return {"error": "Unexpected response from get_id_by_uuid"}, 500


def get_object_by_uuid(uuid, model):
    """A utility function that retrieves a record based on its uuid from a given model."""
    try:
        # Query to fetch the full object using the uuid
        query = db.session.query(model).filter(
            model.uuid == uuid, model.is_delete == False
        )
        obj = query.one_or_none()

        # If the object is not found, return a 400 error
        if obj is None:
            raise CustomException(
                status_code=404,
                message=f"{model.__name__} with uuid '{uuid}' not found",
            )

        # Return the found object
        return obj

    except NoResultFound:
        raise CustomException(status_code=404, message=f"No result found for {uuid}")

    except MultipleResultsFound:
        raise CustomException(
            status_code=400, message=f"Multiple records found for {uuid}"
        )
    except CustomException as e:
        # Log the error and return a 500 error with the exception message
        # Use e.message directly
        raise CustomException(e.message, e.status_code)
    except Exception as e:
        # Log the error and return a 500 error with the exception message
        raise CustomException(status_code=500, message=f"An error occurred: {str(e)}")


def set_existing_object(data, model, existing_data):
    mapper = inspect(model)
    relationships = {rel.key: rel.mapper.class_ for rel in mapper.relationships}
    for field, value in data.items():
        related_model_class = relationships.get(field)
        if isinstance(value, dict) and "uuid" in value:
            related_instance = (
                db.session.query(related_model_class.id)
                .filter_by(uuid=value["uuid"])
                .scalar()
            )
            field = f"{field}_id"
            value = related_instance
            if hasattr(existing_data, field) and value is not None:
                setattr(existing_data, field, value)
        else:
            if hasattr(existing_data, field) and value is not None:
                setattr(existing_data, field, value)


def transform_data(key, data):
    for old_key in key:
        if old_key.endswith("_uuid"):  # Check if key ends with "_uuid"
            # Remove "_uuid" to create new key
            new_key = key.replace("_uuid", "")
            data[new_key] = {"uuid": data[old_key]}
    return data  # Return unchanged if no matching key


def set_object_id_exists(obj, model, data):
    for field, value in data.items():
        if isinstance(value, dict):
            print(f"⚠️ Skipping {field}: Nested dictionary detected")
            continue  # Handle nested objects separately
        setattr(obj, field, value)
    return obj


def map_uuids_to_ids(data_dict, field_mappings, mapped_dict):
    for field, model, model_id_field, id_field in field_mappings:
        if data_dict.get(field):
            result = set_id_if_exists_in_dict(
                data_dict[field], model, model_id_field, mapped_dict, id_field
            )
            if result is not True:
                return result
            data_dict.pop(field)
    return True


def convert_date_format_in_str(value, format_str="%Y-%m-%d %H:%M:%S"):
    if isinstance(value, datetime):
        return value.strftime(format_str)

    date_formats = [
        "%Y-%m-%dT%H:%M:%S.%fZ",  # ISO 8601 format
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%d %H:%M:%S",  # MySQL datetime format
        "%Y-%m-%d",  # Date only format
    ]

    for date_format in date_formats:
        try:
            parsed_date = datetime.strptime(value, date_format)
            return parsed_date.strftime(format_str)
        except ValueError:
            continue  # Try the next format if parsing fails

    raise CustomException(status_code=400, message="Invalid Date Format")


def check_date_format(value):
    date_formats = [
        "%Y-%m-%dT%H:%M:%S.%fZ",  # ISO 8601 format
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%d %H:%M:%S",  # MySQL datetime format
        "%Y-%m-%d",  # Date only format
    ]

    # Flag to indicate if a valid date was found
    valid_date_found = False

    for date_format in date_formats:
        try:
            # Parse the string according to the current format
            dt = datetime.strptime(value, date_format)
            # Format it to a MySQL-compatible string
            data_value = dt.strftime("%Y-%m-%d %H:%M:%S")
            # Set the formatted value to the object's field

            valid_date_found = True  # A valid date was parsed
            return data_value
            break  # Exit the loop once a valid format is found
        except ValueError:
            continue  # Try the next format if parsing fails

    if not valid_date_found:
        raise CustomException(status_code=400, message="Invalid Date Formmated")
