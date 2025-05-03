import json
from flask import request
from flask_restx import Resource
from app.main.business.util.category.category_dto import CategoryDto
from app.main.business.service.category import category_service as service
from app.main.utils.payload.common_model_dto import CommonModelDto

api = CategoryDto.api
create_category_parser = CategoryDto.create_category_parser
data_model = CategoryDto.category_res
request_payload = CategoryDto.request_payload
request_list = CategoryDto.data_list


@api.route("/")
@api.response(400, "error", CommonModelDto.create_response_dto)
@api.response(500, "Internal server error", CommonModelDto.create_response_dto)
class CategoryAdd(Resource):
    """Handles operations for category data."""

    @api.expect(create_category_parser)
    @api.response(
        201, "Category created successfully", CommonModelDto.create_response_dto
    )
    def post(self):
        """Create a new category."""
        args = create_category_parser.parse_args()
        data = json.loads(args["data"])
        image = args.get("image")
        return service.create_entity(data, image)


@api.route("/list")
class CategoryList(Resource):
    """Handles retrieval of categories."""

    @api.expect(request_payload)
    @api.marshal_with(request_list)
    def post(self):
        """Retrieve a list of categories with optional filters."""
        data = request.json
        return service.get_all_entities(data)


@api.route("/<int:id>")
@api.param("id", "Category ID", required=True)
class CategoryDetail(Resource):
    """Handles operations for a single category."""

    @api.marshal_with(data_model)
    def get(self, id):
        """Retrieve a category by ID."""
        return service.get_entity_by_id(id)

    @api.expect(create_category_parser)
    @api.response(
        200, "Category updated successfully", CommonModelDto.create_response_dto
    )
    def put(self, id):
        """Update an existing category."""
        args = create_category_parser.parse_args()
        data = json.loads(args["data"])
        image = args.get("image", None)
        return service.update_entity(id, data, image)

    @api.response(200, "Category deleted successfully")
    def delete(self, id):
        """Delete a category."""
        return service.soft_delete(id)
