from flask import request
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.main.business.service.cart.cart_service import (
    add_cart,
    get_cart_list,
    get_cart_summary,
    get_cart_summary_page_details,
    get_total_cart_item_qty,
    move_item_to_wishlist,
    remove_cart,
)
from app.main.business.util.cart.cart_dto import CartDto

# from ..service.cart_service import c

from ....user.service.user_service import get_entity_by_id, get_user_by_username

from flask_restx import reqparse

api = CartDto.cart_namespace
# _cart_model = CartDto.card_master_fields
_cart_create_parser = CartDto.cart_item_fields
_cart_create = CartDto.cart_item_fields_req
_save_cart_dto = CartDto.save_cart_dto
_cart_count = CartDto.cart_item_count
_cart_list = CartDto.cart_item_list
_cart_list_req = CartDto.add_to_cart_req
cart_item_qty = CartDto.cart_item_qty
cart_success = CartDto.cart_success
_cart_item_empty = CartDto.cart_item_empty
_cart_calculation_res = CartDto.cart_calculation_response
_cart_save_res = CartDto.cart_save_res


def str_to_bool(value):
    if isinstance(value, bool):
        return value
    if value.lower() in ("yes", "true", "t", "y", "1"):
        return True
    elif value.lower() in ("no", "false", "f", "n", "0"):
        return False
    else:
        return False


query_parser = reqparse.RequestParser()
query_parser.add_argument("code", type=str, help="The code parameter")


@api.route("/cart-save")
# Resource for creating a new cart
class CartCreationResource(Resource):
    @api.doc("/save-cart")
    @api.expect(_save_cart_dto, validate=False)
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = get_entity_by_id(id=current_user)
        data = request.json
        return add_cart(data=data, user=user), 201


@api.route("/cart-list")
class CartList(Resource):
    @api.doc("/list_of_cart")
    @api.expect(_cart_list_req, validate=False)
    @api.marshal_list_with(_cart_list, envelope="data")
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = request.json
        user = get_entity_by_id(id=current_user)
        return get_cart_list(data=data, user=user), 200


@api.route("/move-to-wishlist")
class CartWishList(Resource):
    @api.doc("/move_to_wishlist")
    @api.expect(_cart_list_req, validate=False)
    @jwt_required()
    def patch(self):
        data = request.json
        return move_item_to_wishlist(cart_item_id=data.get("cart_item_id")), 200


@api.route("/total-quantity")
class CartList(Resource):
    @api.doc("/quantity_of_cart")
    @api.marshal_with(cart_item_qty)
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        data = request.json
        user = get_entity_by_id(id=current_user)
        return get_total_cart_item_qty(user=user), 200


@api.route("/cart-remove")
class CartDelete(Resource):
    @api.doc("/remove_of_cart")
    @api.expect(_cart_create, validate=False)
    # @api.marshal_list_with(_cart_list, envelope="data")
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = request.json
        user = get_entity_by_id(id=current_user)
        return remove_cart(data=data, user=user), 200


@api.route("/get-summary")
class CartUpdate(Resource):
    @api.doc("Get cart calculation summary", body=query_parser)
    @api.marshal_with(_cart_calculation_res)
    @jwt_required()
    def get(
        self,
    ):
        """Get cart calculation"""
        current_user = get_jwt_identity()
        user = get_entity_by_id(id=current_user)
        args = query_parser.parse_args()
        code_param = args["code"]
        return get_cart_summary(user, code_param), 200

        # return get_cart_summary(user), 200


@api.route("/summary-page-details/<user_id>")
@api.param("user_id", "The User identifier")
class CartSummaryPage(Resource):
    @api.doc("Get cart calculation summary")
    @api.marshal_with(_cart_calculation_res)
    @jwt_required()
    def get(self, user_id):
        """Get cart calculation"""
        return get_cart_summary_page_details(user_id), 200
