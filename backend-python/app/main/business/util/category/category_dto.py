import json
from flask_restx import Namespace, fields, marshal
from flask_restx import reqparse
from werkzeug.datastructures import FileStorage

from app.main.utils.payload.common_model_dto import CommonModelDto


class CategoryDto:
    """Data Transfer Object (DTO) for Category."""

    api = Namespace("Category", description="API for managing categories")

    category_image = api.model(
        "CategoryImage",
        {
            "id": fields.Integer(description="ID of the associated image"),
            "url": fields.String(description="URL of the category image"),
        },
    )

    category_res = api.model(
        "CategoryResponse",
        {
            "id": fields.Integer(description="ID of the category"),
            "name": fields.String(required=True, description="Name of the category"),
            "description": fields.String(description="Description of the category"),
            "category_img_id": fields.Integer(description="Image ID"),
            "category_img": fields.Nested(
                category_image, description="Category image details"
            ),
            "category_img_path": fields.String(
                description="Description of the category"
            ),
            **CommonModelDto.common_model_dto,
        },
    )

    category_data = api.model(
        "CategoryDataRequest",
        {
            "id": fields.Integer(),
            "name": fields.String(required=True, description="Name of the category"),
            "description": fields.String(description="Description of the category"),
        },
    )

    json_schema = json.dumps(marshal({}, category_data), indent=4)

    create_category_parser = reqparse.RequestParser()
    create_category_parser.add_argument(
        "image",
        type=FileStorage,
        location="files",
        required=False,
        help="Category Image",
    )
    create_category_parser.add_argument(
        "data",
        type=str,
        required=False,
        help=str(json_schema),
    )

    request_payload = api.model(
        "CategoryRequestPayload",
        {
            **CommonModelDto.common_req,
        },
    )

    data_list = api.model(
        "CategoryListData",
        {
            "data": fields.List(
                fields.Nested(category_res), description="List of categories"
            ),
            **CommonModelDto.data_list,
        },
    )
