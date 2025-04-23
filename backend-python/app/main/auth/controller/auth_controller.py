from flask import request
from flask_restx import Resource

from ..service.auth_service import login_user, refresh_access
from ..util.auth_dto import AuthDto
from ..util.auth_request import AuthRequest
from ..util.auth_response import AuthResponse

api = AuthDto.api
_user = AuthDto.user
_auth_request = AuthDto.auth_request


@api.route("/generate-token")
@api.expect(_user, validate=True)
class GenerateToken(Resource):
    @api.doc("Generates token", body=_user)
    @api.response(code=200, description="Success", model=AuthDto.auth_response_dto)
    # @api.marshal_with(AuthDto.auth_response_dto, envelope='data')
    def post(self):
        """Generate token"""
        data = request.json
        response = login_user(data)
        return response


@api.route("/refresh-token")
class RefreshToken(Resource):
    # @api.doc("Refreshes token", body=_auth_request)
    @api.expect(_auth_request, validate=True)
    # @api.marshal_with(_auth, envelope='data')
    @api.response(200, "tokens", AuthDto.tokens_dto)
    def post(self):
        """Refresh token"""
        data = request.json
        return refresh_access(data.get("refresh_token"))
