from flask_restx import Namespace, fields


class FirebaseTokenDto:
    api = Namespace("Firebase Token", description="Firebase Token related operations")
    firebase_token = api.model(
        "firebase_token_create",
        {
            "user_id": fields.Integer(),
            "device_type": fields.String(),
            "firebase_token": fields.String(required=True),
            "device_id": fields.String(required=True),
        },
    )
    firebase_token_list_req = api.model(
        "firebase_token_list_req",
        {
            "user_id": fields.Integer(),
            "page_number": fields.Integer(),
            "firebase_token": fields.String(required=True),
            "page_size": fields.Integer(required=True),
        },
    )
