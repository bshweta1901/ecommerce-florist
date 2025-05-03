from flask import current_app
from werkzeug.utils import secure_filename
import os

from app.main.exceptation.custom_exception import CustomException

# from .predefined_service import get_predefined_by_type_and_code
from ..model.document_master import DocumentMaster
from ..model.predefined_master import PredefinedMaster
import uuid
from werkzeug.utils import secure_filename


import mimetypes

import os
import traceback
from ....extensions import db


def validate_file_format(file, entity_type):
    try:
        # Log the max file size
        max_file_size = current_app.config.get(
            "MAX_CONTENT_LENGTH", 10 * 1024 * 1024
        )  # Default to 10 MB if not found in config
        current_app.logger.info(f"Max File Size: {max_file_size}")

        if file.content_length > max_file_size:
            raise CustomException(status_code=400, message="File Size Limit Exceeded")

            # predefined_master = get_predefined_by_type_and_code(
            #     "FILE-FORMAT", f"{entity_type}-FILE-FORMAT"
            # )

            # if predefined_master is not None and len(predefined_master) > 0:
            #     # Save File format in list
            #     format_list = (
            #         predefined_master[0].name.split(",")
            #         if "," in predefined_master[0].name
            #         else [predefined_master[0].name]
            #     )
            current_app.logger.info(f"Format List: {format_list}")

            # Check file format
        # if file.mimetype in format_list:
        # current_app.logger.info("File format is valid")
        return True

        # raise CustomException(
        #     status_code=400, message=f"Only Supports {', '.join(format_list)}"
        # )

    except CustomException as e:
        # Use e.message directly
        raise CustomException(e.message, e.status_code)
    except Exception as e:
        raise CustomException(str(e), 500)  # Use e.message directly


# Function to get file type based on file extension
def get_file_type(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type


def save_multipart_file_and_get_path(multipart_file, folder_name):
    try:
        current_app.logger.info("Initializing DocumentMaster")
        document_master = DocumentMaster()
        file = None
        absolute_path = ""
        file_path = ""
        actual_path = ""

        # validate_file_format(multipart_file, "PROFILE")

        current_app.logger.info(
            f"Creating folder path: {os.path.join(current_app.config['DOCUMENT_TEMP_UPLOAD'], folder_name)}"
        )
        folder_path = os.path.join(
            current_app.config["DOCUMENT_TEMP_UPLOAD"], folder_name
        )
        current_app.logger.info(f"Creating folder path: {folder_path}")
        os.makedirs(folder_path, exist_ok=True)
        current_app.logger.info("make directory:")
        set_directory_permissions_recursively(folder_path)

        try:
            file_name = secure_filename(multipart_file.filename)
            file_path = os.path.join(
                folder_path, str(uuid.uuid4()) + "-" + file_name.replace(" ", "")
            )
            current_app.logger.info(f"Opening file for writing: {file_path}")
            file = open(file_path, "wb")

            set_file_permissions(file_path)

            current_app.logger.info("Writing data to file")
            file.write(multipart_file.read())
            file.close()

            absolute_path = os.path.abspath(file_path)
            document_master.document_selected_path = os.path.dirname(absolute_path)
            document_master.document_name = os.path.basename(file_path)
            path = current_app.config["DOCUMENT_TEMP_URL"]
            file_path_string = file_path
            actual_path = current_app.config["DOCUMENT_TEMP_UPLOAD"]
            url_path = os.path.join(
                current_app.config["DOCUMENT_TEMP_URL"],
                file_path_string[len(actual_path) :],
            )
            url_path = url_path.replace("\\", "/")
            current_app.logger.info(f"url path: {url_path}")
            # current_app.logger.info(f"config url path: {current_app.config["DOCUMENT_TEMP_URL"]}")
            document_master.file_path = url_path
            document_master.actual_path = file_path_string
            current_app.logger.info(f"doc file path: {document_master.file_path}")
            current_app.logger.info("Document creation successful")
            return document_master

        except Exception as e:
            traceback.print_exc()
            current_app.logger.error(
                f"An error occurred while writing to file: {str(e)}"
            )
            raise e

    except Exception as e:
        traceback.print_exc()
        current_app.logger.error(f"An error occurred: {str(e)}")
        raise e


def set_directory_permissions_recursively(directory):
    try:
        if not os.path.exists(directory) or not os.path.isdir(directory):
            current_app.logger.info(
                f"set_directory_permissions_recursively: {directory}"
            )
            return
        current_app.logger.error(f"start permission {str(directory)}")
        read_flag = os.chmod(directory, 0o777)
        current_app.logger.error(f"read permission {str(directory)}")
        write_flag = os.chmod(directory, 0o777)
        current_app.logger.error(f"write permission {str(directory)}")
        execute_flag = os.chmod(directory, 0o777)
        current_app.logger.error(f"execute permission {str(directory)}")

        parent_directory = os.path.dirname(directory)
        current_app.logger.error(f"parent direc {str(parent_directory)}")
        document_upload_path = os.path.abspath(
            current_app.config["DOCUMENT_TEMP_UPLOAD"]
        )
        current_app.logger.error(f"document_upload_path {str(document_upload_path)}")
        if (
            parent_directory
            and os.path.abspath(parent_directory) != document_upload_path
        ):
            current_app.logger.error("recursively ")
            set_directory_permissions_recursively(parent_directory)
    except Exception as e:
        current_app.logger.error(f"error {str(e)}")
        raise e


def set_file_permissions(file_path):
    if os.path.exists(file_path):
        read_flag = os.chmod(file_path, 0o777)
        write_flag = os.chmod(file_path, 0o777)
        execute_flag = os.chmod(file_path, 0o777)
        current_app.logger.error(
            f"File permission flags for {os.path.abspath(file_path)}: Read={read_flag}, Write={write_flag}, Execute={execute_flag}"
        )
        print(
            f"File permission flags for {os.path.abspath(file_path)}: Read={read_flag}, Write={write_flag}, Execute={execute_flag}"
        )


def save_document(document_data):
    print(document_data)
    data = document_data.save()
    return data


def get_predefined_by_type_and_code(entity_type, code):
    query = PredefinedMaster.query.filter(PredefinedMaster.is_delete == "N")
    if entity_type != None and entity_type != "" and code != None and code != "":
        query = query.filter(
            PredefinedMaster.entity_type == entity_type, PredefinedMaster.code == code
        )
    elif entity_type != None and entity_type != "":
        query = query.filter(PredefinedMaster.entity_type == entity_type)
    elif code != None and code != "":
        query = query.filter(PredefinedMaster.code == code)
    return query.all()


def delete_old_image(document_ids_list, session):
    try:
        documents = (
            session.query(DocumentMaster)
            .filter(DocumentMaster.document_id.in_(document_ids_list))
            .all()
        )

        if documents:
            for document in documents:
                file_path = document.actual_path
                if os.path.exists(file_path):
                    os.remove(file_path)
                session.delete(document)
            session.flush()
    except Exception as e:
        current_app.logger.error(f"Error deleting old image: {str(e)}")
        raise


def upload_document(file, base_directory, entity_type, old_document_id=None):
    try:
        if old_document_id is not None:
            document = DocumentMaster.query.filter(
                DocumentMaster.id == old_document_id
            ).first()
            filePathString = document.file_path
            actualPath = current_app.config["DOCUMENT_TEMP_URL"]
            filePath = os.path.join(
                current_app.config["DOCUMENT_TEMP_UPLOAD"],
                filePathString[len(actualPath) :],
            )
            if os.path.exists(filePath):
                os.remove(filePath)
            document.id = old_document_id
        folder_path = os.path.join(
            current_app.config["DOCUMENT_TEMP_UPLOAD"], base_directory
        )

        validate_file_format(file, entity_type)
        document = save_multipart_file_and_get_path(file, folder_path)

        document.entity_name = entity_type
        document.file_type = get_file_type(document.actual_path)

        document_master = save_document(document)
        return document_master

    except Exception as e:
        current_app.logger.error(f"An error occurred during document upload: {str(e)}")
        raise CustomException("an error occur" + str(e), 500)


def upload_image(data, file, base_directory, entity_type, field, is_upload=False):
    try:
        if getattr(data, field, None) is None:
            document_master = upload_document(file, base_directory, entity_type)
        else:
            old_document_id = getattr(data, field)
            document_master = upload_document(
                file, base_directory, entity_type, old_document_id
            )

        setattr(data, field, document_master.id)

        if is_upload:
            db.session.add(data)
            db.session.commit()

        return data
    except Exception as e:
        print(f"Error uploading image: {e}")
        return None


def upload_and_link_documents(
    entity_instance, files, base_directory, entity_type, linking_model, entity_field
):
    """
    Upload multiple files and link them dynamically to any entity (Product, Category, etc.)

    Args:
        entity_instance: The database model instance (like ProductMaster, Category, etc.).
        files: List of uploaded files.
        base_directory: Folder location for saving.
        entity_type: String to identify entity type (e.g., 'product', 'category').
        linking_model: The linking table model (e.g., ProductDocument).
        entity_field: The field name in linking_model that points to the entity (e.g., 'product_id').

    Returns:
        Updated entity_instance.
    """
    try:

        if not files:
            return entity_instance

        for file in files:
            # 1. Upload the file to DocumentMaster
            document_master = upload_document(file, base_directory, entity_type)

            # 2. Create a linking record dynamically
            linking_record = linking_model(
                **{
                    entity_field: entity_instance.id,
                    "document_id": document_master.id,
                }
            )

            db.session.add(linking_record)

        db.session.commit()

        return entity_instance

    except Exception as e:
        db.session.rollback()
        raise e


# Function call (fixed syntax)
