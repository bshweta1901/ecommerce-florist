from flask import request
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....user.service.user_service import get_user_by_username

from ..util.review_dto import ReviewDTO
from ..service.review_service import (
    create_review,
    get_review_by_id,
    get_all_reviews,
    get_count_reviews,
)

api = ReviewDTO.review_namespace

_review_create = ReviewDTO._save_review_model
_review_list = ReviewDTO._review_response
_review_req = ReviewDTO._review_req


@api.route("/review-save")
class ReviewCreationResource(Resource):
    @api.doc("/save-review", body=_review_create)  # Replace with your review schema
    @api.expect(_review_create, validate=False)
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = request.json
        create_review(data=data, user=get_user_by_username(current_user))
        return {"message": "Review saved successfully"}, 201


@api.route("/review-count")
class ReviewCount(Resource):
    @api.doc("/count_of_reviews", body=_review_req)
    @api.expect(_review_req, validate=False)  # Replace with your query schema
    # @jwt_required()
    def post(self):
        data = request.json
        return get_count_reviews(data=data), 200


@api.route("/review-list")
class ReviewCount(Resource):
    @api.doc("/list_of_reviews", body=_review_req)
    @api.expect(_review_req, validate=False)  # Replace with your query schema
    # @jwt_required()
    def post(self):
        data = request.json
        response = get_all_reviews(data=data)
        return api.marshal(response, _review_list)


@api.route("/review/<review_id>")
@api.param("review_id", "The review identifier")
@api.response(404, "Review not found.")
class ReviewGet(Resource):
    @api.doc("/get_review")
    # @jwt_required()
    def get(self, review_id):
        response = get_review_by_id(review_id)
        return api.marshal(response, _review_list)
