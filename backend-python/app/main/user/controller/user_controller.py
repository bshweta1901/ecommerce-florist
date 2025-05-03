import asyncio
import json
from flask import request
from flask_cors import cross_origin
from flask_restx import Resource

from app.main.auth.util.auth_dto import AuthDto
from app.main.user.util.user_dto import UserDto
from app.main.user.service import user_service as service
from app.main.utils.payload.common_model_dto import CommonModelDto
from flask_jwt_extended import (
    jwt_required,
    get_jwt,
    verify_jwt_in_request,
    get_jwt_identity,
)
from jwt import ExpiredSignatureError
import datetime

api = UserDto.api
_create_user_parser = UserDto.create_user_parser
request_payload = UserDto.list_request_payload
user_data_model = UserDto.user
user_data_list = UserDto.data_list
create_user = UserDto.create_user
role = UserDto.role_list
_access_token = UserDto.access_token_dto


@api.route("/my-profile")
@api.response(400, "error", CommonModelDto.create_response_dto)
@api.response(500, "Internal server error", CommonModelDto.create_response_dto)
class GetUserFromAccessToken(Resource):
    @api.marshal_with(user_data_model)
    @api.doc("Get user from access token")
    @jwt_required()
    def get(self):
        """Get user from access token"""
        try:
            current_jwt = get_jwt()
            exp_timestamp = current_jwt.get("exp")
            exp_date = datetime.datetime.fromtimestamp(exp_timestamp)
            # if exp_timestamp:
            #     local_timestamp = time.time()  # Get current local timestamp
            #     if local_timestamp < exp_timestamp:
            #         # Token expired but still valid
            #         return {"message": "TOKEN_EXPIRED"}, 401

            uuid = get_jwt_identity()
            return service.get_entity_by_id(uuid), 200

        except ExpiredSignatureError:
            return {"message": "TOKEN_EXPIRED"}, 401


@api.route("/")
@api.response(400, "error", CommonModelDto.create_response_dto)
@api.response(500, "Internal server error", CommonModelDto.create_response_dto)
class UserAdd(Resource):
    """Handles operations for user data."""

    @api.expect(_create_user_parser)
    @api.response(201, "success", CommonModelDto.create_response_dto)
    def post(self):
        """Create a new user data entry."""
        args = _create_user_parser.parse_args()
        data = json.loads(args["data"])
        image = args.get("image", None)
        return service.create_entity(data, image)


@api.route("/list")
class UserList(Resource):
    """Handles operations for user data."""

    @api.expect(request_payload)
    @api.marshal_list_with(user_data_list)
    def post(self):
        """Fetch all user data with optional filters."""
        data = request.json
        return service.get_all_entities(data)


@api.route("/<int:id>")
@api.param("id", "user Data ID", required=True)
class User(Resource):
    """Handles operations for a single user data entry."""

    @api.marshal_with(user_data_model)
    def get(self, id):
        """Fetch a single user data entry by ID."""
        return service.get_entity_by_id(id)

    @api.expect(create_user)
    @api.response(200, "success", CommonModelDto.create_response_dto)
    def put(self, id):
        """Update an existing user data entry."""
        data = request.json
        return service.update_entity(id, data)

    def patch(self, id):
        """Change the status of a user data entry."""
        return service.change_status(id)

    def delete(self, id):
        """Soft delete a user data entry."""
        return service.soft_delete(id)


@api.route("/username/<string:username>")
@api.param("username", "user Data username", required=True)
class GetUserByUsername(Resource):
    """Handles operations for a single user data entryfrom Username."""

    @api.marshal_with(user_data_model)
    def get(self, username):
        """Fetch a single user data entry by Username."""
        return service.get_user_by_username(username)


@api.route("/roles")
@api.response(400, "error", CommonModelDto.error_response_dto)
@api.response(500, "Internal server error", CommonModelDto.error_response_dto)
class ListRoles(Resource):
    @api.marshal_list_with(role)
    @api.doc("List of Roles")
    def get(self):
        """List of Roles"""

        return service.list_roles()


# SUPPORT uSER eND POINTS

send_otp = UserDto.user_send_otp_req
verify_otp = UserDto.user_verify_otp_req


@api.route("/send-otp")
@api.response(400, "error", CommonModelDto.error_response_dto)
@api.response(500, "Internal server error", CommonModelDto.error_response_dto)
class UserOtp(Resource):
    @api.expect(send_otp, validate=True)
    @cross_origin(origin="*", headers="*")
    @api.doc("send otp")
    def post(self):
        "Sends otp to email or phone or both depending on the role of user"

        otp_res = service.send_otp(request.json)
        return otp_res


@api.route("/verify-otp")
@api.response(400, "error", CommonModelDto.error_response_dto)
@api.response(500, "Internal server error", CommonModelDto.error_response_dto)
class UserOtpVerify(Resource):
    # @api.doc("verify otp registration", body=_user_otp_req)
    @api.expect(verify_otp)
    @api.response(200, "verify otp adn give auth response", AuthDto.auth_response_dto)
    # @api.marshal_with(_user_otp_res)
    @api.doc("verify otp")
    @cross_origin(
        origin="*",
    )
    def post(self):
        "Verify Otp sent to user"

        return service.verify_otp(request.json)
