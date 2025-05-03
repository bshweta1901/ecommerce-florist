import json
from flask_restx import Namespace, fields, marshal
from flask_restx import reqparse
from werkzeug.datastructures import FileStorage

from app.main.utils.payload.common_model_dto import CommonModelDto


class SubCategoryDto:
    """Data Transfer Object (DTO) for SubCategory."""

    api = Namespace("SubCategory", description="API for managing sub-categories")

    sub_category_image = api.model(
        "SubCategoryImage",
        {
            "id": fields.Integer(description="ID of the associated image"),
            "url": fields.String(description="URL of the sub-category image"),
        },
    )

    category_info = api.model(
        "CategoryInfo",
        {
            "id": fields.Integer(description="ID of the parent category"),
            "name": fields.String(description="Name of the parent category"),
        },
    )

    sub_category_res = api.model(
        "SubCategoryResponse",
        {
            "id": fields.Integer(description="ID of the sub-category"),
            "name": fields.String(
                required=True, description="Name of the sub-category"
            ),
            "description": fields.String(description="Description of the sub-category"),
            "category_id": fields.Integer(description="ID of the parent category"),
            "category": fields.Nested(
                category_info, description="Parent category details"
            ),
            "sub_category_img_id": fields.Integer(description="Sub-category Image ID"),
            "sub_category_img": fields.Nested(
                sub_category_image, description="Sub-category image details"
            ),
        },
    )

    sub_category_data = api.model(
        "SubCategoryDataRequest",
        {
            "id": fields.Integer(),
            "name": fields.String(
                required=True, description="Name of the sub-category"
            ),
            "description": fields.String(description="Description of the sub-category"),
            "category_id": fields.Integer(
                required=True, description="Parent category ID"
            ),
        },
    )

    json_schema = json.dumps(marshal({}, sub_category_data), indent=4)

    create_sub_category_parser = reqparse.RequestParser()
    create_sub_category_parser.add_argument(
        "image",
        type=FileStorage,
        location="files",
        required=False,
        help="Sub-Category Image",
    )
    create_sub_category_parser.add_argument(
        "data",
        type=str,
        required=False,
        help=str(json_schema),
    )

    request_payload = api.model(
        "SubCategoryRequestPayload",
        {
            **CommonModelDto.common_req,
        },
    )

    data_list = api.model(
        "SubCategoryListData",
        {
            "data": fields.List(
                fields.Nested(sub_category_res), description="List of sub-categories"
            ),
            **CommonModelDto.data_list,
        },
    )
