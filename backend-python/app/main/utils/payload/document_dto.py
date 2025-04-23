from flask_restx import Namespace, fields


class DocumentDto:
    document_api = Namespace(
        "document", description="Document Master related operations"
    )
    document_res = document_api.model(
        "DocumentRes",
        {
            "document_id": fields.Integer(description="Document ID"),
            "document_name": fields.String(description="Document Name"),
            "file_path": fields.String(description="File Path"),
        },
    )
