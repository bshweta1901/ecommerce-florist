from flask_restx import fields, Namespace

from ...product.util.product_dto import ProductDto
from ...service_management.utils.service_management_dto import ServiceMasterDto
from ...vehicle.util.vehicle_dto import VehicleDTO


class CartDto:
    # Create a Namespace
    cart_namespace = Namespace("cart", description="Cart operations")

    # Reference the product fields from ProductDto
    product_fields = ProductDto._product_response
    _vehicle = VehicleDTO._vehicle_response

    # Define expected fields using fields
    cart_item_fields = cart_namespace.model(
        "cart_item_fields",
        {
            "cart_item_id": fields.Integer(required=True, description="Cart Item"),
            "product": fields.Nested(product_fields),
            "quantity": fields.Integer(required=True, description="Product Quantity"),
            "total_amount": fields.Float(description="Total Amount for the product"),
        },
    )
    cart_save_res = cart_namespace.model(
        "cart_save_res", {"cart_item_id": fields.Integer(required=False)}
    )
    save_cart_dto = cart_namespace.model(
        "save_cart_dto",
        {
            "product_id": fields.Integer(required=True),
            "item_quantity": fields.Integer(
                required=False, description="Product Quantity"
            ),
            "is_wishList": fields.Boolean(required=False, description="Is WishList"),
        },
    )

    save_cart_dto = cart_namespace.model(
        "save_cart_dto",
        {
            "product_id": fields.Integer(required=True),
            "item_quantity": fields.Integer(
                required=False, description="Product Quantity"
            ),
            "is_wishList": fields.Boolean(required=False, description="Is WishList"),
        },
    )

    cart_item_fields_req = cart_namespace.model(
        "cart_item_fields_req",
        {
            "cart_item_id": fields.Integer(required=True, description="Product ID"),
            "quantity": fields.Integer(required=True, description="Product Quantity"),
        },
    )

    cart_item_empty = cart_namespace.model(
        "cart_item_empty",
        {},
    )

    cart_calculation_response = cart_namespace.model(
        "cart_calculation_response",
        {
            "subtotal": fields.Float(),
            "gst": fields.Float(),
            "total": fields.Float(),
            "discount": fields.Float(),
            "total_sum": fields.Float(),
            "credit_discount": fields.Float(),
            "wallet_discount": fields.Float(),
        },
    )

    cart_item_list = cart_namespace.model(
        "CartItem",
        {
            "cart_item_id": fields.Integer(description="Cart Item ID"),
            "product_id": fields.Integer(description="Product ID"),
            "item_quantity": fields.Integer(description="Quantity"),
            "total_amount": fields.Float(description="Total Amount"),
            "discount": fields.Float(description="Discount"),
            "is_wishList": fields.Boolean(description="Is WishList"),
            "created_by_id": fields.Integer(description="User ID"),
            "created_date": fields.DateTime(description="Creation Date"),
            "service_id": fields.Integer(),
            "service": fields.Nested(ServiceMasterDto.service_master_dto),
            "vehicle_id": fields.Integer(),
            "vehicle": fields.Nested(
                _vehicle
                # {
                #     "product_id": fields.Integer(description="Product ID"),
                #     "product_name": fields.String(description="Product Name"),
                # }
            ),
            "product": fields.Nested(
                product_fields
                # {
                #     "product_id": fields.Integer(description="Product ID"),
                #     "product_name": fields.String(description="Product Name"),
                # }
            ),
        },
    )

    add_to_cart_req = cart_namespace.model(
        "add_to_cart_req",
        {
            "is_wishList": fields.Boolean(description="Is WishList"),
            "is_user": fields.Boolean(description="Is User"),
            "product_id": fields.Integer(required=False, description="Product ID"),
            "created_id": fields.Integer(required=False, description="Created ID"),
            "service_id": fields.Integer(required=False, description="Created ID"),
            "variant_id": fields.Integer(required=False, description="Created ID"),
        },
    )

    cart_item_qty = cart_namespace.model(
        "cart_item_qty",
        {"total_quantity": fields.Integer(description="Quantity")},
    )

    cart_item_count = cart_namespace.model(
        "cart_item_count",
        {"count": fields.Integer(description="Count")},
    )

    cart_success = cart_namespace.model(
        "cart_success",
        {"message": fields.String(description="Message")},
    )
