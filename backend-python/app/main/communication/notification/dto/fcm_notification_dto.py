from flask_restx import Namespace, fields


class FirebaseNotificationDto:
    api = Namespace(
        "Firebase Notification", description="Firebase Notification related operations"
    )
    model = api.model(
        "model",
        {"key": fields.Integer(), "value": fields.List(fields.String())},
    )
    firebase_notification = api.model(
        "firebase_notification",
        {
            "template_code": fields.String(),
            "to": fields.List(fields.String()),
            "user_id": fields.List(fields.Integer()),
            "topic": fields.String(required=False),
            "message": fields.String(required=False),
            "title": fields.String(required=False),
            "model": fields.Nested(model, required=False),
        },
    )

    firebase_list_req = api.model(
        "firebase_list_req",
        {
            "id": fields.String(example="[1]"),
            "page_number": fields.Integer(),
            "type": fields.String(required=True),
            "page_size": fields.Integer(required=True),
        },
    )

    firebase_list_res = api.model(
        "firebase_list_res",
        {
            "log_id": fields.Integer(),
            "title": fields.String(),
            "message": fields.String(required=False),
            "entity_type": fields.String(required=False),
            "type": fields.String(required=False),
            "status": fields.String(required=False),
            "notification_read": fields.Boolean(required=False),
            "created_at": fields.DateTime(required=False),
        },
    )
