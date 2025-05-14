import json
from flask_restx import Namespace, fields, marshal
from app.main.business.util.category.category_dto import CategoryDto
from app.main.business.util.category.sub_category_dto import SubCategoryDto
from app.main.utils.payload.common_model_dto import CommonModelDto
from flask_restx import reqparse
from werkzeug.datastructures import FileStorage

from app.main.utils.payload.predefined_dto import PredefinedDto


class ProductDto:
    """
    Data Transfer Object (DTO) for Product.
    Defines API models for handling product-related operations.
    """

    api = Namespace("Product", description="API for managing product data")

    product_image = api.model(
        "ProductImage",
        {
            "id": fields.Integer(description="ID of the image"),
            "file_path": fields.String(description="URL of the image"),
        },
    )
    remove_img_model = api.model(
        "RemoveImages",
        {
            "ids": fields.List(
                fields.Integer, required=True, description="List of product image IDs"
            )
        },
    )

    product_res = api.model(
        "ProductResponse",
        {
            "id": fields.Integer(description="ID of the product"),
            "name": fields.String(description="Name of the product"),
            "description": fields.String(description="Description of the product"),
            "short_description": fields.String(
                description="Short Description of the product"
            ),
            "price": fields.Float(description="Price of the product"),
            "product_status_name": fields.String(description="Price of the product"),
            "offer_price": fields.Float(description="Offer Price of the product"),
            "sku": fields.String(description="SKU number"),
            "product_status_id": fields.Integer(description="Status ID of the product"),
            "category": fields.Nested(
                CategoryDto.category_res, description="Category ID of the product"
            ),
            "is_default_img_path": fields.String(description="Price of the product"),
            "product_status": fields.Nested(
                PredefinedDto.predefined_res, description="Category ID of the product"
            ),
            "sub_category": fields.Nested(
                SubCategoryDto.sub_category_res,
                description="Sub Category ID of the product",
            ),
            "category_id": fields.Integer(description="Category ID of the product"),
            "sub_category_id": fields.Integer(
                description="Sub Category ID of the product"
            ),
            "product_images": fields.List(
                fields.Nested(product_image),
                description="List of product images",
            ),
            **CommonModelDto.common_model_dto,
        },
    )

    product_data = api.model(
        "ProductDataRequest",
        {
            "id": fields.Integer(),
            "name": fields.String(required=True, description="Name of the product"),
            "description": fields.String(description="Description of the product"),
            "price": fields.Float(required=True, description="Price of the product"),
            "sku": fields.Integer(required=True, description="SKU number"),
            "product_status_id": fields.Integer(description="Status ID of the product"),
            "category_id": fields.Integer(description="Category ID of the product"),
            "sub_category_id": fields.Integer(
                description="Sub Category ID of the product"
            ),
        },
    )

    # Convert model structure to a JSON schema dynamically
    json_schema = json.dumps(marshal({}, product_data), indent=4)

    create_product_parser = reqparse.RequestParser()
    create_product_parser.add_argument(
        "images",
        type=FileStorage,
        location="files",
        required=False,
        action="append",  # 👈 important to accept multiple images
        help="Product Images (multiple allowed)",
    )
    create_product_parser.add_argument(
        "defaultImage",
        type=FileStorage,
        location="files",
        required=False,  # 👈 important to accept multiple images
        help="Product Images (multiple allowed)",
    )
    create_product_parser.add_argument(
        "data",
        type=str,
        required=False,
        help=str(json_schema),
    )

    request_payload = api.model(
        "ProductRequest",
        {
            **CommonModelDto.common_req,
        },
    )

    data_list = api.model(
        "ProductListData",
        {
            "data": fields.List(
                fields.Nested(product_res),
                description="List of products",
            ),
            **CommonModelDto.data_list,
        },
    )
