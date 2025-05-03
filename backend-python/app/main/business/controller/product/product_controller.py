import json
from flask import request
from flask_restx import Resource
from app.main.business.util.product.product_dto import ProductDto
from app.main.business.service.product import product_service as service
from app.main.utils.payload.common_model_dto import CommonModelDto

api = ProductDto.api
create_product_parser = ProductDto.create_product_parser
data_model = ProductDto.product_res
request_payload = ProductDto.request_payload
request_list = ProductDto.data_list


@api.route("/")
@api.response(400, "error", CommonModelDto.create_response_dto)
@api.response(500, "Internal server error", CommonModelDto.create_response_dto)
class ProductAdd(Resource):
    """Handles operations for product data."""

    @api.expect(create_product_parser)
    @api.response(
        201, "Product created successfully", CommonModelDto.create_response_dto
    )
    def post(self):
        """Create a new product entry."""
        args = create_product_parser.parse_args()
        data = json.loads(args["data"])
        images = args.get("images", None)
        return service.create_entity(data, images)


@api.route("/list")
class ProductList(Resource):
    """Handles retrieval of products."""

    @api.expect(request_payload)
    @api.marshal_with(request_list)
    def post(self):
        """Retrieve a list of products with optional filters."""
        data = request.json
        return service.get_all_entities(data)


@api.route("/<int:id>")
@api.param("id", "Product ID", required=True)
class ProductDetail(Resource):
    """Handles operations for a single product."""

    @api.marshal_with(data_model)
    def get(self, id):
        """Retrieve a product by ID."""
        return service.get_entity_by_id(id)

    @api.expect(create_product_parser)
    @api.response(
        200, "Product updated successfully", CommonModelDto.create_response_dto
    )
    def put(self, id):
        """Update an existing product."""
        args = create_product_parser.parse_args()
        data = json.loads(args["data"])
        images = args.get("images", None)
        return service.update_entity(id, data, images)

    @api.response(200, "Product deleted successfully")
    def delete(self, id):
        """Delete a product."""
        return service.soft_delete(id)


@api.route("/remove-product-img/<string:ids>")
class ProductImageDelete(Resource):
    @api.response(200, "Images removed successfully")
    @api.response(400, "Invalid input")
    def delete(self, ids):
        try:
            # Convert comma-separated string to list of integers
            id_list = [int(id.strip()) for id in ids.split(",") if id.strip().isdigit()]
        except ValueError:
            return {"message": "Invalid ID format"}, 400

        if not id_list:
            return {"message": "No valid image IDs provided"}, 400

        # Call your service with the list
        service.remove_product_img(id_list)
        return {"message": "Images removed successfully"}, 200
