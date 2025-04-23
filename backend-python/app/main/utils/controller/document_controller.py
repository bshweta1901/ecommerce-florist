from app.config import DevelopmentConfig
import os
from flask import request, current_app
from flask_restx import Resource
import logging

from ..payload.document_dto import DocumentDto
from ..service.predefined_service import get_all_entities
from ..service.document_service import save_multipart_file_and_get_path, save_document

api = DocumentDto.document_api


@api.route("/")
class DocumentUpload(Resource):
    @api.response(200, "Document uploaded successfully")
    @api.expect(api.parser().add_argument("file", location="files", type="file"))
    def post(self):
        """Upload a document"""
        file = request.files["file"]
        upload_dir = DevelopmentConfig.UPLOAD_FOLDER
        os.makedirs(upload_dir, exist_ok=True)

        # Save the file to the server
        file_path = os.path.join(upload_dir, file.filename)
        # file.save(file_path)
        file_to_save = save_multipart_file_and_get_path(file, file_path)
        saved_file = save_document(file_to_save)

        return {"message": "Document uploaded successfully"}
