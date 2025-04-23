from flask import request
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

# from ..service.cart_service import c
from .util.cart_dto import CartDto

from .service.cart_service import (
    add_cart,
    get_cart_list,
    remove_cart,
    remove_item,
    update_cart,
    get_total_cart_item_qty,
    get_cart_summary,
    get_cart_summary_page_details,
    get_cart_list_count,
    move_item_to_wishlist,
    add_cart_for_service_point,
)
from ....user.service.user_service import get_user_by_username

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
query_parser.add_argument("is_credit", type=str_to_bool, help="The code parameter")
query_parser.add_argument("is_wallet", type=str_to_bool, help="The code parameter")
query_parser.add_argument("sp_id", type=str, help="The code parameter")


@api.route("/cart-save")
# Resource for creating a new cart
class CartCreationResource(Resource):
    @api.doc("/save-cart")
    @api.expect(_save_cart_dto, validate=False)
    @api.marshal_list_with(_cart_save_res, envelope="data")
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = get_user_by_username(username=current_user)
        data = request.json
        return add_cart(data=data, user=user), 201


@api.route("/cart-save-pos")
# Resource for creating a new cart
class CartCreationResource(Resource):
    @api.doc("/save-cart-pos")
    @api.expect(_save_cart_dto, validate=False)
    # @api.marshal_list_with(_cart_create_parser, envelope="data")
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = get_user_by_username(username=current_user)
        data = request.json
        add_cart_for_service_point(data=data, user=user)
        return {"message": "Cart Save Successfully"}, 201


@api.route("/cart-list")
class CartList(Resource):
    @api.doc("/list_of_cart")
    @api.expect(_cart_list_req, validate=False)
    @api.marshal_list_with(_cart_list, envelope="data")
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = request.json
        user = get_user_by_username(username=current_user)
        return get_cart_list(data=data, user=user), 200


@api.route("/cart-count")
class CartCount(Resource):
    @api.doc("/count_of_cart_items")
    @api.expect(_cart_list_req, validate=False)
    @api.marshal_with(_cart_count)
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = request.json
        user = get_user_by_username(username=current_user)
        return get_cart_list_count(data=data, user=user), 200


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
        user = get_user_by_username(username=current_user)
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
        user = get_user_by_username(username=current_user)
        return remove_cart(data=data, user=user), 200


@api.route("/remove-item/<cart_item_id>")
@api.param("cart_item_id", "The User identifier")
class CartItemDelete(Resource):
    @api.doc("Removes all the quantity for the item")
    @jwt_required()
    @api.marshal_with(cart_success)
    @api.expect(_cart_item_empty, validate=False)
    def post(self, cart_item_id):
        current_user = get_jwt_identity()
        # data = request.json
        user = get_user_by_username(username=current_user)
        remove_item(cart_item_id, user=user)
        return {"message": "Cart Item removed successfully"}, 200


@api.route("/update/<cart_id>")
@api.param("cart_id", "The Cart identifier")
@api.response(404, "Cart not found.")
class CartUpdate(Resource):
    @api.doc("/update_cart")
    @api.expect(_cart_create, validate=False)
    def put(self, cart_id):
        """Update cart"""
        data = request.json

        return update_cart(cart_id, data=data), 201


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
        user = get_user_by_username(username=current_user)
        args = query_parser.parse_args()
        code_param = args["code"]
        is_credit = args["is_credit"]
        is_wallet = args["is_wallet"]
        sp_id = args["sp_id"]
        return get_cart_summary(user, code_param, is_credit, is_wallet, sp_id), 200

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
