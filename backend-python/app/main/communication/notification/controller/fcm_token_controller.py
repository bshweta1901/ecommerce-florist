from flask import request
from flask_restx import Resource
import json
from ..service.fcm_token_service import (
    create_firebase_token,
    get_all_firebase_token,
    get_firebase_token_count,
)
from ..dto.firebase_token_dto import FirebaseTokenDto
from flask_jwt_extended import jwt_required

api = FirebaseTokenDto.api
firebase_token_dto = FirebaseTokenDto.firebase_token
_list_req = FirebaseTokenDto.firebase_token_list_req


@api.route("/save")
class FirebaseTokenSave(Resource):
    @api.doc("/save_firebase_token", body=firebase_token_dto)
    @api.expect(firebase_token_dto, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        data = request.json
        create_firebase_token(data=data)
        return {"message": "Firebase Token save Successfully"}


@api.route("/list")
class FirebaseTokenList(Resource):
    @api.doc("/list_of_firebase_token", body=_list_req)
    @api.expect(firebase_token_dto, validate=False)
    def post(self):
        """List all Firebase Token"""
        data = request.json
        firebase_token_list = get_all_firebase_token(data=data)
        response = api.marshal(firebase_token_list, firebase_token_dto)

        return response, 200


@api.route("/count")
class FirebaseTokenCount(Resource):
    @api.doc("/count_of_firebase_token", body=_list_req)
    @api.expect(firebase_token_dto, validate=False)
    def post(self):
        """Count all Firebase Token"""
        data = request.json
        Coupon_count = get_firebase_token_count(data=data)
        # return Coupon_count
        return Coupon_count, 200
