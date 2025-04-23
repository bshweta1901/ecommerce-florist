from flask_restx import Namespace, fields


class EmailDto:
    api = Namespace("Email", description="Email related operations")

    email_dto = api.model(
        "FirebaseNotification",
        {
            "template_code": fields.String(),
            "to": fields.String(),
            "subject": fields.String(),
            "content": fields.String(),
            "cc": fields.List(fields.String()),
            "bcc": fields.List(fields.String()),
            "file_attachments ": fields.List(
                fields.String
            ),  # file attachments should be a list of tuples (filename, filedata)
            "model": fields.Raw(required=False),
        },
    )
