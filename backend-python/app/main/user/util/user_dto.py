import json
from flask_restx import reqparse
from email.policy import default

from attrs import field
from flask_restx import Namespace, fields, marshal, reqparse
from werkzeug.datastructures import FileStorage
from app.main.auth.util.auth_dto import AuthDto
from app.main.utils.payload.common_model_dto import CommonModelDto
from app.main.utils.payload.predefined_dto import PredefinedDto

# from app.main.user.util.customer_dto import CustomerDto
from ...utils.payload.document_dto import DocumentDto


class UserDto:
    api = Namespace("User", description="user related operations")
    _common_dto = CommonModelDto.common_model_dto
    _predefined_dto = PredefinedDto.predefined_data

    _document_dto = DocumentDto.document_res

    role = api.model(
        "role",
        {
            "id": fields.Integer(default=1),
            "uuid": fields.String(default="sdjhjdkds"),
            "name": fields.String(default="Admin"),
            "code": fields.String(default="ADMIN"),
            "description": fields.String(default="Role of Administrator"),
        },
    )
    access_token_dto = api.model("AccessTokenDTO", {"access_token": fields.String()})
    role_list = api.model(
        "role_list",
        {"data": fields.List(fields.Nested(role))},
    )
    user = api.model(
        "UserData",
        {
            "id": fields.Integer(),
            "username": fields.String(),
            "email": fields.String(),
            "phone": fields.String(),
            "roles": fields.List(fields.Nested(role)),  # List of roles
            "full_name": fields.String(),
            "description": fields.String(),
            # "sports_experience": fields.String(),
            # "dob": fields.String(),  # Use ISO format string for Date
            # "roles": fields.List(fields.Nested(role)),
            # "gender": fields.Nested(_predefined_dto),
            # "profile_img": fields.Nested(_document_dto),
            # "facebook_auth_token": fields.String(),
            # "google_auth_token": fields.String(),
            # "apple_auth_token": fields.String(),
            **_common_dto,
        },
    )
    list_request_payload = api.model(
        "UserListRequest",
        {
            "role_code": fields.String(),
            "city_id": fields.Integer(),
            "role_id": fields.Integer(),
            "gender_id": fields.Integer(),
            "referred_by_id": fields.Integer(),
            "player_type_id": fields.Integer(),
            **CommonModelDto.list_payload_dto,
        },
    )

    data_list = api.model(
        "UserListData",
        {
            "data": fields.List(fields.Nested(user), description="List of master data"),
            **CommonModelDto.data_list,
        },
    )

    create_user = api.model(
        "CreateUser",
        {
            "id": fields.Integer(default=1),
            "username": fields.String(default="8963569874"),
            "email": fields.String(default="user@yopmail.com"),
            "phone": fields.String(default="8963569874"),
            # List of roles
            "roles": fields.List(fields.String(), default=["ADMIN", "USER"]),
            "full_name": fields.String(default="John Doe"),
            "description": fields.String(default="User description"),
            "sports_experience": fields.String(default="Beginner"),
            "dob": fields.Date(default="2000-01-01"),  # Default in ISO format
            "city_id": fields.Integer(default=1),
            "gender_id": fields.Integer(default=1),
            "facebook_auth_token": fields.String(default="fb-token-placeholder"),
            "google_auth_token": fields.String(default="google-token-placeholder"),
            "apple_auth_token": fields.String(default="apple-token-placeholder"),
            "avg_rating": fields.Float(default=0.0),
            "referral_code": fields.String(default="REF12345"),
            # Self-referential field
            "referred_by_id": fields.Integer(default=1),
            "player_type_id": fields.Integer(default=1),
            "screen_stage": fields.String(default="stage-1"),
        },
    )

    # Convert the model structure to a JSON schema dynamically
    json_schema = json.dumps(marshal({}, create_user), indent=4)

    create_user_parser = reqparse.RequestParser()
    create_user_parser.add_argument(
        "image", type=FileStorage, location="files", required=False, help="User Profile"
    )
    create_user_parser.add_argument(
        "data",
        type=str,
        required=False,
        help=str(json_schema),
    )

    #  SUPPORTS USER OTP

    user_otp = api.model(
        "UserOTP",
        {"email": fields.String(), "phone": fields.String()},
    )
    user_otp_res = api.model(
        "UserOTPRes",
        {
            "otp": fields.String(required=False, description="user otp"),
            "message": fields.String(required=False, description="user otp message"),
        },
    )
    user_otp_verify__res = api.model(
        "UserOTPRes",
        {**AuthDto.auth_response_dto},
    )

    user_send_otp_req = api.model(
        "UserSendOTPReq",
        {
            "username": fields.String(description="user username"),
            "email": fields.String(description="user email"),
            "phone": fields.String(description="user phone"),
            "roles": fields.String(required=True, description="user role"),
        },
    )

    user_verify_otp_req = api.model(
        "UserVerifyOTPReq",
        {
            "username": fields.String(description="user username"),
            "otp": fields.String(required=False, description="user otp"),
            "roles": fields.String(required=False, description="user role"),
        },
    )
