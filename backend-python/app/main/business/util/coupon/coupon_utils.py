from flask_restx import Namespace, fields


class CouponDto:
    coupon_api = Namespace("coupon", description="Coupon related operations")

    coupon_create = coupon_api.model(
        "CouponCreate",
        {
            "name": fields.String(
                description="Coupon Name",
            ),
            "code": fields.String(
                description="Coupon",
            ),
            "discount": fields.Float(
                description="Discount Amount",
            ),
            "start_date": fields.Date(
                description="Start Date",
            ),
            "expiry_date": fields.Date(
                description="Expiry Date",
            ),
            "min_slab": fields.Float(description="Minimum Slab"),
            "max_amount": fields.Float(description="Maximum Discount Amount"),
            "total_discount": fields.Float(description="Total Discount"),
            "is_percent": fields.Boolean(description="Is Percentage Discount"),
            "is_unique": fields.Boolean(description="Is Unique Coupon"),
            "description": fields.Boolean(description="Coupon description"),
            "sub_title": fields.Boolean(description="Coupon Sub Title"),
        },
    )
    coupon_update = coupon_api.model(
        "CouponUpdate",
        {
            "name": fields.String(
                description="Coupon Name",
            ),
            "code": fields.String(
                description="Coupon",
            ),
            "discount": fields.Float(
                description="Discount Amount",
            ),
            "start_date": fields.Date(
                description="Start Date",
            ),
            "expiry_date": fields.Date(
                description="Expiry Date",
            ),
            "min_slab": fields.Float(description="Minimum Slab"),
            "max_amount": fields.Float(description="Maximum Discount Amount"),
            "total_discount": fields.Float(description="Total Discount"),
            "is_percent": fields.Boolean(description="Is Percentage Discount"),
            "is_unique": fields.Boolean(description="Is Unique Coupon"),
            "description": fields.Boolean(description="Coupon description"),
            "sub_title": fields.Boolean(description="Coupon Sub Title"),
        },
    )
    coupon_list = coupon_api.model(
        "CouponList",
        {
            "name": fields.String(
                description="Coupon Name",
            ),
            "coupon_id": fields.Integer(
                description="Coupon Id",
            ),
            "code": fields.String(
                description="Coupon",
            ),
            "discount": fields.Float(
                description="Discount Amount",
            ),
            "start_date": fields.Date(
                description="Start Date",
            ),
            "expiry_date": fields.Date(
                description="Expiry Date",
            ),
            "min_slab": fields.Float(description="Minimum Slab"),
            "max_amount": fields.Float(description="Maximum Discount Amount"),
            "total_discount": fields.Float(description="Total Discount"),
            "is_percent": fields.Boolean(description="Is Percentage Discount"),
            "is_unique": fields.Boolean(description="Is Unique Coupon"),
            "description": fields.String(description="Coupon description"),
            "sub_title": fields.String(description="Coupon Sub Title"),
            "is_deactivate": fields.String(required=False, description="is_deactivate"),
        },
    )
    coupon_list_req = coupon_api.model(
        "CouponListRequest",
        {
            "start_date": fields.Date(description="Start date"),
            "end_date": fields.Date(description="End date"),
            "page_number": fields.Integer(),
            "page_size": fields.Integer(),
            "search_by": fields.String(),
        },
    )
    apply_coupon_req = coupon_api.model(
        "ApplyCouponRequest",
        {
            "user_id": fields.Integer(description="Start date"),
            "code": fields.String(description="End date"),
            "amount": fields.Float(),
        },
    )
