from flask_restx import Namespace, fields
from ...product.util.product_dto import ProductDto
from ....user.util.dto import UserDto


class ReviewDTO:
    _user = UserDto.user
    _product = ProductDto._product_response
    review_namespace = Namespace("review", description="Review operations")

    _save_review_model = review_namespace.model(
        "SaveReviewModel",
        {
            "rating": fields.Float(required=False, description="Rating (e.g., 1-5)"),
            "comments": fields.String(required=False, description="Review comments"),
            "product_id": fields.Integer(
                required=False, description="ID of the product being reviewed"
            ),
            "user_id": fields.Integer(
                required=False, description="ID of the product being reviewed"
            ),
        },
    )

    _review_response = review_namespace.model(
        "ReviewResponse",
        {
            "review_id": fields.Integer(readonly=True, description="Review ID"),
            "rating": fields.Float(description="Rating"),
            "comments": fields.String(description="Review comments"),
            "product": fields.Nested(_product),
            "user": fields.Nested(_user),
        },
    )
    _review_req = review_namespace.model(
        "ReviewResponse",
        {
            "rating": fields.Float(description="Rating"),
            "product_id": fields.Integer(),
            "user_id": fields.Integer(),
            "page_number": fields.Integer(),
            "page_size": fields.Integer(),
        },
    )
