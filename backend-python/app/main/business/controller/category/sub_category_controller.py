import json
from flask import request
from flask_restx import Resource
from app.main.business.util.category.sub_category_dto import SubCategoryDto
from app.main.business.service.category import sub_category_service as service
from app.main.utils.payload.common_model_dto import CommonModelDto

api = SubCategoryDto.api
create_sub_category_parser = SubCategoryDto.create_sub_category_parser
data_model = SubCategoryDto.sub_category_res
request_payload = SubCategoryDto.request_payload
request_list = SubCategoryDto.data_list


@api.route("/")
@api.response(400, "error", CommonModelDto.create_response_dto)
@api.response(500, "Internal server error", CommonModelDto.create_response_dto)
class SubCategoryAdd(Resource):
    """Handles operations for subcategory data."""

    @api.expect(create_sub_category_parser)
    @api.response(
        201, "SubCategory created successfully", CommonModelDto.create_response_dto
    )
    def post(self):
        """Create a new subcategory."""
        args = create_sub_category_parser.parse_args()
        data = json.loads(args["data"])
        image = args.get("image", None)
        return service.create_entity(data, image)


@api.route("/list")
class SubCategoryList(Resource):
    """Handles retrieval of subcategories."""

    @api.expect(request_payload)
    @api.marshal_with(request_list)
    def post(self):
        """Retrieve a list of subcategories with optional filters."""
        data = request.json
        return service.get_all_entities(data)


@api.route("/<int:id>")
@api.param("id", "SubCategory ID", required=True)
class SubCategoryDetail(Resource):
    """Handles operations for a single subcategory."""

    @api.marshal_with(data_model)
    def get(self, id):
        """Retrieve a subcategory by ID."""
        return service.get_entity_by_id(id)

    @api.expect(create_sub_category_parser)
    @api.response(
        200, "SubCategory updated successfully", CommonModelDto.create_response_dto
    )
    def put(self, id):
        """Update an existing subcategory."""
        args = create_sub_category_parser.parse_args()
        data = json.loads(args["data"])
        image = args.get("image", None)
        return service.update_entity(id, data, image)

    @api.response(200, "SubCategory deleted successfully")
    def delete(self, id):
        """Delete a subcategory."""
        return service.soft_delete(id)
