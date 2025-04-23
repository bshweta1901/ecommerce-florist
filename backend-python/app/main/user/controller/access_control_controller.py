from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, reqparse

from ...user.service.user_service import get_user_by_username
from ..service.access_control_service import get_access_control_list
# from ..service.cart_service import c
from ..util.access_control_dto import AccessControlDto

api = AccessControlDto.api
_res = AccessControlDto.access_control_response
# pagination_parser = reqparse.RequestParser()
# pagination_parser.add_argument(
#     "page_number", type=int, default=1, help="Page number", required=False
# )
# pagination_parser.add_argument(
#     "page_size", type=int, default=1, help="Page number", required=False
# )


@api.route("/list")
class AccessControlList(Resource):
    @api.doc(
        params={
            "page_number": {
                "in": "query",
                "description": "Page number",
                "type": "int",
                "default": 1,
            },
            "page_size": {
                "in": "query",
                "description": "Page number",
                "type": "int",
                "default": 1,
            },
        }
    )
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        # data = request.json
        user = get_user_by_username(username=current_user)
        user_address = get_access_control_list(user=user)
        return api.marshal(user_address, _res), 200
