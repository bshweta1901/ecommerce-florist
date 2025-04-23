from ..model.coupon_model import CouponMaster
from .....extensions import db
from datetime import datetime
from flask_restx import abort
from ...order.model.order import OrderMaster
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy import func, cast, Numeric, Date


def create_coupon(data):
    try:
        coupon = CouponMaster.query.filter(
            CouponMaster.code == data.get("code")
        ).first()
        if coupon is not None:
            return {"message": "Duplicate Coupon Code."}, 400
        start_date = data.get("start_date")
        expiry_date = data.get("expiry_date")
        if data.get("max_amount") is not None and data.get("max_amount") == "":
            data["max_amount"] = None
        if data.get("min_slab") is not None and data.get("min_slab") == "":
            data["min_slab"] = None
        if start_date is not None and expiry_date is not None:
            if start_date > expiry_date:
                return {"message": "Start date cannot be Greater than Expiry Date "}
            if expiry_date < start_date:
                return {"message": "Expiry date cannot be Greater than Start Date "}

        coupon = CouponMaster(**data)
        db.session.add(coupon)
        db.session.commit()
        return {
            "message": "Coupon created successfully",
        }, 201
    except Exception as e:
        db.session.rollback()
        return {
            "error": str(e),
        }, 500


def get_all_coupon(data):
    query = CouponMaster.query.filter(CouponMaster.is_delete == "N")
    query = query_criteria(query, data)
    page = int(data["page_number"]) if "page_number" in data else None
    per_page = int(data["page_size"]) if "page_size" in data else None
    query = query.order_by(CouponMaster.coupon_id.desc())
    if page is not None and per_page is not None:
        coupon = query.paginate(page=page, per_page=per_page).items
    else:
        coupon = query.all()

    return coupon


def query_criteria(query, data):
    search_by = data.get("search_by", None)
    start_date = data.get("start_date", None)
    end_date = data.get("end_date", None)
    is_deactivate = data.get("is_deactivate", None)
    is_client = data.get("is_client", None)
    if is_client:
        today_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(cast(CouponMaster.start_date, Date) <= today_date.date())
        query = query.filter(cast(CouponMaster.expiry_date, Date) >= today_date.date())

    if is_deactivate:
        query = query.filter(CouponMaster.is_deactivate == is_deactivate)
    if search_by:
        query = query.filter(
            db.or_(
                CouponMaster.name.ilike(f"%{search_by}%"),
                CouponMaster.code.ilike(f"%{search_by}%"),
            )
        )
    if start_date:
        if isinstance(start_date, str):
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(CouponMaster.expiry_date >= start_date)

    if end_date:
        if isinstance(end_date, str):
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
        end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(CouponMaster.expiry_date <= end_date)

    return query


def get_coupon_count(data):
    query = CouponMaster.query.filter(CouponMaster.is_delete == "N")
    query = query_criteria(query, data)
    coupon = query.count()
    return {"count": coupon}


def get_coupon(coupon_id):
    coupon = CouponMaster.query.get(coupon_id)
    return coupon


def update_coupon(coupon_id, data):
    try:

        start_date = data.get("start_date")
        expiry_date = data.get("expiry_date")
        if start_date is not None and expiry_date is not None:
            if start_date > expiry_date:
                return {
                    "message": "Start date cannot be Greater than Expiry Date "
                }, 400
            if expiry_date < start_date:
                return {
                    "message": "Expiry date cannot be Greater than Start Date "
                }, 400

        old_coupon = CouponMaster.query.get_or_404(coupon_id)
        if data.get("code") is not None and data.get("code") != old_coupon.code:
            coupon = CouponMaster.query.filter(
                CouponMaster.code == data.get("code")
            ).first()
            if coupon is not None:
                return {"message": "Duplicate Coupon Code."}, 400
        if old_coupon:
            for field in data:
                if hasattr(old_coupon, field) and data.get(field) not in (
                    None,
                    "",
                ):  # Check for valid fields and non-null/empty values
                    setattr(old_coupon, field, data[field])

            # Commit changes to the database
            db.session.add(old_coupon)
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e

    return {"message": f"Coupon {coupon_id} updated successfully"}, 200


def apply_coupon(data):
    code = data.get("code", None)
    user_id = data.get("user_id", None)
    amount = data.get("amount", None)
    current_date = datetime.now().date()
    coupon_master = CouponMaster.query.filter(
        CouponMaster.code == code,
        CouponMaster.is_deactivate == "N",
        CouponMaster.is_delete == "N",
    ).first()
    if coupon_master is None:
        abort(400, error="Coupon doesn't exists!")
    if coupon_master.code:
        if coupon_master.start_date:
            if current_date < coupon_master.start_date:
                abort(400, error="Coupon doesn't exists!")

        if coupon_master.expiry_date:
            if current_date > coupon_master.expiry_date:
                abort(400, error="Coupon is expired!")

        if coupon_master.is_unique:
            # Check if the promo code is already used by the user
            if is_coupon_used(user_id, coupon_master.coupon_id):
                abort(400, error="Coupon is already used")

        discount_amount = coupon_master.discount

        if coupon_master.min_slab:
            # Check if the membership plan amount meets the minimum slab
            if amount < coupon_master.min_slab:
                abort(
                    400,
                    error=f"To apply this coupon, the minimum amount should be {coupon_master.min_slab}.",
                )
        if coupon_master.is_percent:
            # Convert amount to float if it's not already
            amount = float(amount)

            # Calculate discount as a percentage
            discount_amount = amount * (coupon_master.discount / 100)
            discount_amount = round(discount_amount, 2)  # rounding to 2 decimal places

        if coupon_master.max_amount:
            # Check if the discount exceeds the maximum amount
            if discount_amount > coupon_master.max_amount:
                discount_amount = coupon_master.max_amount
            if discount_amount > amount:
                discount_amount = amount
    return {"discount": discount_amount, "coupon_id": coupon_master.coupon_id}


def is_coupon_used(user_id, coupon_id):
    order = OrderMaster.query.filter(
        OrderMaster.user_id == user_id, OrderMaster.coupon_id == coupon_id
    ).first()
    if order is None:
        return False
    else:
        return True


def change_status(coupon_id):
    coupon_id = CouponMaster.query.get_or_404(coupon_id)
    if coupon_id.is_deactivate == "N":
        coupon_id.is_deactivate = "Y"
    else:
        coupon_id.is_deactivate = "N"
    db.session.add(coupon_id)
    db.session.commit()


def delete_coupon(coupon_id):
    coupon_id = CouponMaster.query.get_or_404(coupon_id)
    if coupon_id.is_delete == "N":
        coupon_id.is_delete = "Y"
    else:
        coupon_id.is_delete = "N"
    db.session.add(coupon_id)
    db.session.commit()
