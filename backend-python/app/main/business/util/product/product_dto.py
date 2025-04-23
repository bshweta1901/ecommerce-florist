from flask_restx import Namespace, fields
from ....utils.payload.predefined_dto import PredefinedDto
from ..util.product_feature_dto import ProductFeatureDto

from ....utils.payload.document_dto import DocumentDto
from werkzeug.datastructures import FileStorage
from flask_restx import reqparse


class ProductDto:
    product_api = Namespace("product", description="Product related operations")
    _predefined = PredefinedDto.predefined

    document_product_dto = product_api.model(
        "document_product_dto",
        {
            "document": fields.Nested(
                DocumentDto.document_res, description="Document details"
            ),
            "product_id": fields.Integer(description="Product ID"),
            "product_document_id": fields.Integer(description="Product Document ID"),
        },
    )

    document_product_dto = product_api.model(
        "document_product_dto",
        {
            "document": fields.Nested(
                DocumentDto.document_res, description="Document details"
            ),
            "product_id": fields.Integer(description="Product ID"),
            "product_document_id": fields.Integer(description="Product Document ID"),
        },
    )

    product = product_api.model(
        "product_master",
        {
            "product_id": fields.Integer(
                required=False, description="Id of the product"
            ),
            "product_name": fields.String(required=False, description="Product name"),
            "product_price": fields.Float(required=False, description="Product price"),
            "product_offer_price": fields.Float(
                required=False, description="Product offer price"
            ),
            "category": fields.Nested(
                _predefined, only=("predefined_id", "name", "code", "entity_type")
            ),
            "make": fields.Nested(
                _predefined, only=("predefined_id", "name", "code", "entity_type")
            ),
            "model": fields.Nested(
                _predefined, only=("predefined_id", "name", "code", "entity_type")
            ),
            "variant": fields.Nested(
                _predefined, only=("predefined_id", "name", "code", "entity_type")
            ),
            "brand": fields.Nested(PredefinedDto.predefined_res),
            "document_as_product": fields.List(
                fields.Nested(document_product_dto),
            ),
        },
    )

    _product_response = product_api.model(
        "ProductResponse",
        {
            "product_id": fields.Integer(required=False),
            "is_wishlist": fields.Boolean(),
            "is_goto": fields.Boolean(),
            "is_wishlist": fields.Boolean(),
            "is_goto": fields.Boolean(),
            "product_name": fields.String(required=False),
            "warranty": fields.String(required=False),
            "rating": fields.String(required=False),
            "width": fields.Nested(PredefinedDto.predefined_res),
            "aspect_ratio": fields.Nested(PredefinedDto.predefined_res),
            "rim": fields.Nested(PredefinedDto.predefined_res),
            "key_feature": fields.String(
                required=False,
            ),
            "fit_in_vehicle_name": fields.String(required=False),
            "product_price": fields.Float(required=False),
            "ply_rating": fields.Float(required=False),
            "product_offer_price": fields.Float(attribute="offer_price"),
            "category_id": fields.Integer(required=False),
            "brand_id": fields.Integer(required=False),
            "make_id": fields.Integer(required=False),
            "model_id": fields.Integer(required=False),
            "tyer_type_id": fields.Integer(required=False),
            "tyer_ps_id": fields.Integer(required=False),
            "variant_id": fields.Integer(required=False),
            "product_img": fields.String(),
            "description": fields.String(),
            "model": fields.Nested(PredefinedDto.predefined_res),
            "make": fields.Nested(PredefinedDto.predefined_res),
            "variant": fields.Nested(PredefinedDto.predefined_res),
            "brand": fields.Nested(PredefinedDto.predefined_res),
            "category": fields.Nested(PredefinedDto.predefined_res),
            "tyer_type": fields.Nested(PredefinedDto.predefined_res),
            "product_type": fields.Nested(PredefinedDto.predefined_res),
            "product_type_id": fields.Integer(required=False),
            "tyre_construction": fields.Nested(PredefinedDto.predefined_res),
            "tyre_construction_id": fields.Integer(required=False),
            "tyer_ps": fields.Nested(PredefinedDto.predefined_res),
            "variant": fields.Nested(PredefinedDto.predefined_res),
            "product_feature": fields.List(
                fields.Nested(ProductFeatureDto.product_feature_model)
            ),
            "document_as_product": fields.List(
                fields.Nested(document_product_dto), attribute="product_documents"
            ),
            "discounted_price": fields.Float(default=0.0, required=False),
            "entity_type": fields.String(
                description="sort_by list search by", example="POPULAR/RECOMMENDED"
            ),
            "reviews_rating": fields.Float(),
            "reviews_count": fields.Integer(),
            "is_deactivate": fields.String(required=False, description="is_deactivate"),
            "purchase_price": fields.Float(),
            "product_gst": fields.Float(),
            "hsn_code": fields.String(),
            "compatible_vehicles": fields.String(),
            "cart_item_id": fields.Integer(),
            "slug": fields.String(),
            "gst_id": fields.Integer(),
            "gst": fields.Nested(_predefined),
        },
    )

    _product_list_req = product_api.model(
        "product_list_req",
        {
            "search_by": fields.String(description="Vehicle list search by"),
            "is_user": fields.Boolean(description="is_user list search by"),
            "sort_by": fields.String(
                description="sort_by list search by",
                example="ASC/DESC/POPULAR/RECOMMENDED",
            ),
            "entity_type": fields.String(
                description="sort_by list search by", example="POPULAR/RECOMMENDED"
            ),
            "created_date_from": fields.Date(
                description="Start date for creation date filter"
            ),
            "created_date_to": fields.Date(
                description="End date for creation date filter"
            ),
            "make_ids": fields.List(
                fields.Integer(), description="Make ID to filter by"
            ),
            "model_ids": fields.List(
                fields.Integer(description="Model ID to filter by")
            ),
            "variant_ids": fields.List(
                fields.Integer(description="Variant ID to filter by")
            ),
            "category_ids": fields.List(fields.Integer()),
            "brand_ids": fields.List(fields.Integer()),
            "tyer_type_ids": fields.List(fields.Integer()),
            "tyer_ps_ids": fields.List(fields.Integer()),
            "width_id": fields.List(
                fields.Integer(description="Width ID to filter by")
            ),
            "rim_id": fields.List(fields.Integer(description="Rim ID to filter by")),
            "aspect_ratio_ids": fields.List(
                fields.Integer(description="Ascpect Ratio ID to filter by")
            ),
            "width_id": fields.List(
                fields.Integer(description="Width ID to filter by")
            ),
            "rim_id": fields.List(fields.Integer(description="Rim ID to filter by")),
            "aspect_ratio_ids": fields.List(
                fields.Integer(description="Ascpect Ratio ID to filter by")
            ),
            "price_range_from": fields.Float(),
            "price_range_to": fields.Float(),
        },
    )

    create_product = product_api.model(
        "create_product",
        {
            "product_name": fields.String(required=False),
            "warranty": fields.String(required=False),
            "rating": fields.String(required=False),
            "width_id": fields.Integer(required=False),
            "aspect_ratio_id": fields.Integer(required=False),
            "rim_id": fields.Integer(required=False),
            "key_feature": fields.String(required=False),
            "fit_in_vehicle_name": fields.String(required=False),
            "product_price": fields.Float(required=False),
            "ply_rating": fields.Float(required=False),
            "product_offer_price": fields.Float(),
            "category_id": fields.Integer(required=False),
            "brand_id": fields.Integer(required=False),
            "make_id": fields.Integer(required=False),
            "model_id": fields.Integer(required=False),
            "tyer_type_id": fields.Integer(required=False),
            "tyer_ps_id": fields.Integer(required=False),
            "product_type_id": fields.Integer(required=False),
            "variant_id": fields.Integer(required=False),
            "product_img": fields.String(),
            "description": fields.String(),
            "feature_ids": fields.List(fields.Integer(description="Feature IDs")),
            "hsn_code": fields.String(),
            "product_gst": fields.Float(),
            "purchase_price": fields.Float(),
            "compatible_vehicles": fields.String(),
            "slug": fields.String(),
            "entity_type": fields.String(),
            "gst_id": fields.Integer(),
        },
    )

    update_product = product_api.model(
        "ProductDTO",
        {
            "product_name": fields.String(required=False),
            "warranty": fields.String(required=False),
            "rating": fields.Integer(required=True),
            "width_id": fields.Integer(required=False),
            "aspect_ratio_id": fields.Integer(required=False),
            "rim_id": fields.Integer(required=False),
            "key_feature": fields.String(required=False),
            "fit_in_vehicle_name": fields.String(required=False),
            "product_price": fields.Float(required=False),
            "ply_rating": fields.Float(required=False),
            "product_offer_price": fields.Float(),
            "category_id": fields.Integer(required=False),
            "brand_id": fields.Integer(required=False),
            "make_id": fields.Integer(required=False),
            "model_id": fields.Integer(required=False),
            "tyer_type_id": fields.Integer(required=False),
            "tyer_ps_id": fields.Integer(required=False),
            "variant_id": fields.Integer(required=False),
            "product_img": fields.String(),
            "description": fields.String(),
            "feature_ids": fields.List(fields.Integer(description="Feature IDs")),
            "slug": fields.String(),
        },
    )

    product_fitment_dto = product_api.model(
        "product_fitment_dto",
        {
            "product_fitment_id": fields.Integer(required=False),
            "product_id": fields.Integer(required=False),
            "category_id": fields.Integer(required=False),
            "product_type_id": fields.Integer(required=False),
            "variant_id": fields.Integer(required=False),
            "make_id": fields.Integer(required=False),
            "model_id": fields.Integer(required=False),
            "category": fields.Nested(_predefined, required=False),
            "product_type": fields.Nested(_predefined, required=False),
            "variant": fields.Nested(_predefined, required=False),
            "make": fields.Nested(_predefined, required=False),
            "model": fields.Nested(_predefined, required=False),
            "product": fields.Nested(product, required=False),
        },
    )

    product_fitment_list_dto = product_api.model(
        "product_fitment_list_dto",
        {
            "product_fitment_id": fields.Integer(required=False),
            "product_id": fields.Integer(required=False),
            "category_id": fields.Integer(required=False),
            "product_type_id": fields.Integer(required=False),
            "variant_id": fields.Integer(required=False),
            "page_number": fields.Integer(required=False),
            "page_size": fields.Integer(required=False),
        },
    )

    import_parser = reqparse.RequestParser()
    import_parser.add_argument(
        "file", location="files", type=FileStorage, required=True, help="Document file"
    )
