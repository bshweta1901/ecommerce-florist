from flask import request
from flask_restx import Resource
import json

from flask_jwt_extended import jwt_required

from app.main.business.service.coupon.coupon_service import create_coupon
from app.main.business.util.coupon.coupon_utils import CouponDto

api = CouponDto.coupon_api
_coupon = CouponDto.coupon_list
_create_coupon_dto = CouponDto.coupon_create
_update_coupon = CouponDto.coupon_update
_list_req = CouponDto.coupon_list_req
_apply_coupon_req = CouponDto.apply_coupon_req


@api.route("/save")
class CouponSave(Resource):
    @api.doc("/save_coupon", body=_create_coupon_dto)
    @api.expect(_create_coupon_dto, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save Coupon"""
        data = request.json
        Coupon_response, _status = create_coupon(data=data)
        return Coupon_response, _status


@api.route("/coupon-list")
class CouponList(Resource):
    @api.doc(
        "/list_of_coupon",
        body=_list_req,
    )
    @api.expect(_coupon, validate=False)
    def post(self):
        """List all Coupon"""
        data = request.json
        coupon_list = get_all_coupon(data=data)
        response = api.marshal(coupon_list, _coupon)

        return response, 200


@api.route("/coupon-by-id/<int:coupon_id>")
@api.response(404, "Coupon not found.")
class CouponById(Resource):
    def get(self, coupon_id):
        """Get Coupon By Id"""
        coupon = get_coupon(coupon_id)
        if not coupon:
            api.abort(404, "Coupon not found.")
        response = api.marshal(coupon, _coupon)
        return response, 200


@api.route("/coupon-count")
class CouponCount(Resource):
    @api.doc("/count_of_coupon", body=_list_req)
    @api.expect(_coupon, validate=False)
    def post(self):
        """Count all Coupon"""
        data = request.json
        Coupon_count = get_coupon_count(data=data)
        # return Coupon_count
        return Coupon_count, 200


@api.route("/update/<int:coupon_id>")
class CouponUpdate(Resource):
    @api.doc("/update_acoupon", body=_update_coupon)
    @api.expect(_update_coupon, validate=False)
    def put(self, coupon_id):
        """Update coupon by ID"""
        data = api.payload
        response, _status = update_coupon(coupon_id, data)
        return response, _status


@api.route("/apply-coupon")
class ApplyCoupon(Resource):
    @api.doc("/apply-coupon", body=_apply_coupon_req)
    # @api.expect(_coupon, validate=False)
    def post(self):
        """Apply Coupon"""
        data = request.json
        coupon_list = apply_coupon(data=data)
        response = coupon_list

        return response, 200


@api.route("/change-status/<int:coupon_id>")
@api.response(404, "Coupon not found.")
class CouponStatusResource(Resource):
    @api.response(200, "Coupon  change status successfully .")
    def patch(self, coupon_id):
        """Coupon by ID"""

        change_status(coupon_id)
        return {
            "status": "success",
            "message": "Coupon Change Status successfully .",
        }, 200


@api.route("/<int:coupon_id>")
@api.response(404, "Coupon not found.")
class CouponDeleteResource(Resource):
    @api.response(200, "Coupon  change status successfully .")
    def delete(self, coupon_id):
        """Coupon by ID"""

        delete_coupon(coupon_id)
        return {
            "status": "success",
            "message": "Coupon Delete successfully .",
        }, 200
