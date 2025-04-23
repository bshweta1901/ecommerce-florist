from flask import request

from flask_restx import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....user.service.user_service import get_user_by_id
from ....user.service.user_service import get_user_by_username

# from flask_restplus import Resource, reqparse
from werkzeug.datastructures import FileStorage
from ..util.product_dto import ProductDto

# from ..service.product_service import get_products
from ..util.product_dto import ProductDto
from ..service.product_service import (
    create_product,
    get_product_list,
    update_product,
    get_product_count,
    get_sp_product_list,
    get_product_by_id,
    get_product_by_slug,
    change_status,
    save_product_fitment,
    update_product_fitment,
    product_fitment_by_id,
    product_fitment_list,
    product_fitment_count,
    product_fitment_delete,
    upload_product_img,
    remove_product_img,
    delete_product,
    import_excel,
    import_battery_excel,
)
import json

api = ProductDto.product_api
_product = ProductDto.product

api = ProductDto.product_api

_product_create = ProductDto.create_product
_product_update = ProductDto.update_product
_product_list = ProductDto._product_response
_product_list_res = ProductDto._product_list_req
_product_fitment_dto = ProductDto.product_fitment_dto
product_fitment_list_dto = ProductDto.product_fitment_list_dto
_import = ProductDto.import_parser

_update_doc = reqparse.RequestParser()
_update_doc.add_argument(
    "file",
    location="files",
    type=FileStorage,
    action="append",
    required=False,
    help="Document file",
)
combined_parser = reqparse.RequestParser()
combined_parser.add_argument(
    "file",
    location="files",
    type=FileStorage,
    action="append",
    required=False,
    help="Document file",
)
combined_parser.add_argument(
    "data",
    type=str,
    required=False,
    help="""{
  "product_name": "Example Tire",
  "warranty": "1 year",
  "rating": "4.5",
  "width_id": 225,
  "aspect_ratio_id": 60,
  "rim_id": 16,
  "key_feature": "All-season performance",
  "fit_in_vehicle_name": "Sedan XYZ",
  "product_price": 120.99,
  "ply_rating": 4.0,
  "product_offer_price": 105.99,
  "category_id": 123,
  "brand_id": 456,
  "make_id": 789,
  "model_id": 101,
  "tyer_type_id": 202,
  "tyer_ps_id": 303,
  "variant_id": 404,
  "product_img": "http://example.com/tire_image.jpg",
  "description": "This is an example tire description."
  "feature_ids": [
    19,
    18,
    17
  ],
  "hsn_code": "String",
  "product_gst":10,
  "purchase_price":100,
  "compatible_vehicles":"hsdjhsjd"
'}""",
)


@api.route("/product-save")
class ProductCreationResource(Resource):
    @api.doc("/save-product", body=combined_parser)
    @api.expect(combined_parser, validate=False)
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        args = combined_parser.parse_args()
        # uploaded_file = args["file"]
        file_storages = args["file"]
        json_data = args["data"]
        data = json.loads(json_data)
        product_data_list = {
            key: data.get(key)
            for key in ProductDto.create_product.__schema__["properties"].keys()
        }

        return create_product(data=product_data_list, user=1, files=file_storages)


@api.route("/product-list")
class ProductList(Resource):
    @api.doc("/list_of_products", body=_product_list_res)
    @api.expect(_product_list, validate=False)
    def post(self):
        # current_user = 1
        # current_user = get_jwt_identity()

        user = None

        data = request.json
        if data.get("user_id"):
            user = get_user_by_id(id=data.get("user_id"))
        products = get_product_list(data=data, user=user)
        return api.marshal(products, _product_list), 200


@api.route("/product-list-sp")
class ProductList(Resource):
    @api.doc("/list_of_products", body=_product_list_res)
    @api.expect(_product_list, validate=False)
    def post(self):
        # current_user = 1
        # current_user = get_jwt_identity()
        user = None
        data = request.json
        if data.get("user_id"):
            user = get_user_by_id(id=data.get("user_id"))
        products = get_sp_product_list(data=data, user=user)
        return api.marshal(products, _product_list), 200


@api.route("/product-count")
class ProductCount(Resource):
    @api.doc("/count_of_products", body=_product_list_res)
    @api.expect(_product_list, validate=False)
    # @jwt_required()
    def post(self):
        data = request.json
        user = None
        if data.get("user_id"):
            user = get_user_by_id(id=data.get("user_id"))
        count = get_product_count(data=data, user=user)
        return count, 200


@api.route("/update/<product_id>")
@api.param("product_id", "The product identifier")
@api.response(404, "product not found.")
class ProductUpdate(Resource):
    @api.doc("/update_product", body=_product_update)
    @api.expect(_product_update, validate=False)
    @jwt_required()
    def put(self, product_id):
        data = request.json
        update_product(product_id, data=data)
        return {"message": "Update Successfully"}, 201


@api.route("/<int:product_id>")
@api.param("product_id", "The product identifier")
@api.response(404, "product not found.")
class ProductById(Resource):
    @api.marshal_list_with(_product_list, envelope="data")
    def get(self, product_id):
        return get_product_by_id(product_id), 201


@api.route("/slug/<slug>")
@api.param("slug", "The product slug identifier")
@api.response(404, "product not found.")
class ProductById(Resource):
    @api.marshal_list_with(_product_list, envelope="data")
    def get(self, slug):
        return get_product_by_slug(slug), 201


@api.route("/change-status/<int:product_id>")
@api.response(404, "Product not found.")
class ProductStatusResource(Resource):
    @api.response(200, "Product  change status successfully .")
    def patch(self, product_id):
        """Product by ID"""

        change_status(product_id)
        return {
            "status": "success",
            "message": "Product Change Status successfully .",
        }, 200


@api.route("/fitment/save")
class ProductFitmentSave(Resource):
    @api.expect(product_fitment_list_dto, validate=False)
    @jwt_required()
    @api.marshal_with(_product_fitment_dto)
    def post(self):
        current_user = get_jwt_identity()
        user = get_user_by_username(current_user)
        data = request.json
        data["created_by_id"] = user.id
        return save_product_fitment(data=data), 200


@api.route("/fitment/update/<int:fitment_id>")
@api.param("fitment_id", "The fitment identifier")
@api.response(404, "fitment not found.")
class ProductFitmentUpdate(Resource):
    @api.expect(product_fitment_list_dto, validate=False)
    @jwt_required()
    @api.marshal_with(_product_fitment_dto)
    def put(self, fitment_id):
        data = request.json
        return update_product_fitment(fitment_id, data=data), 201


@api.route("/fitment/<int:fitment_id>")
@api.param("fitment_id", "The fitment identifier")
@api.response(404, "fitment not found.")
class ProductFitmentById(Resource):
    @api.marshal_list_with(_product_fitment_dto, envelope="data")
    def get(self, fitment_id):
        return product_fitment_by_id(fitment_id), 201


@api.route("/fitment/list")
class ProductFitmentList(Resource):
    @api.expect(product_fitment_list_dto, validate=False)
    @jwt_required()
    @api.marshal_list_with(_product_fitment_dto)
    def post(self):
        data = request.json
        return product_fitment_list(data=data), 200


@api.route("/fitment/count")
class ProductFitmentCount(Resource):
    @api.expect(product_fitment_list_dto, validate=False)
    @jwt_required()
    def post(self):
        data = request.json
        return product_fitment_count(data=data), 200


@api.route("/fitment/delete/<int:fitment_id>")
@api.param("fitment_id", "The fitment identifier")
class ProductFitmentDelete(Resource):
    @jwt_required()
    @api.marshal_with(_product_fitment_dto)
    def delete(self, fitment_id):
        return product_fitment_delete(fitment_id), 200


@api.route("/update-product-img/<product_id>")
@api.param("product_id", "The product identifier")
@api.response(404, "product not found.")
class ProductImageUpdate(Resource):
    @api.doc("/update_product_img", body=_update_doc)
    @api.expect(_update_doc, validate=False)
    # @jwt_required()
    def put(self, product_id):
        args = _update_doc.parse_args()
        file_storages = args["file"]
        # data = request.json
        upload_product_img(product_id, file_storages)
        return {"message": "Image saved successfully"}, 200


@api.route("/remove-product-img/<product_document_id>")
@api.param("product_document_id", "The product identifier")
@api.response(404, "product not found.")
class ProductImageUpdate(Resource):
    # @api.doc("/remove_product_img", body=_update_doc)
    # @api.expect(_update_doc, validate=False)
    # @jwt_required()
    def delete(self, product_document_id):
        remove_product_img(product_document_id), 200
        return {"message": "Image saved successfully"}, 200


@api.route("/product-delete/<int:product_id>")
class DeleteCompany(Resource):
    # @api.expect(_company_price_req, validate=False)
    # @api.marshal_list_with(_user_res)
    # @jwt_required()
    def delete(self, product_id):
        # current_user = get_jwt_identity()
        # user = get_user_by_username/(current_user)
        return delete_product(product_id), 200


@api.route("/import")
class ImportResource(Resource):
    @api.doc("Import Product ", body=_import)
    def post(self):
        """Get departments for a specific driver by ID"""
        args = _import.parse_args()
        file = args["file"]
        response = import_excel(file)
        return {"message": "success"}, 200


@api.route("/import-battery")
class ImportResource(Resource):
    @api.doc("Import Product ", body=_import)
    def post(self):
        """Get departments for a specific driver by ID"""
        args = _import.parse_args()
        file = args["file"]
        response = import_battery_excel(file)
        return {"message": "success"}, 200
