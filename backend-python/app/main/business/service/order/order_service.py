from flask_jwt_extended import get_jwt_identity

from app.main.business.model.order.order import OrderMaster
from app.main.business.model.order.order_item import OrderItem
from app.main.business.service.cart.cart_service import get_cart_list
from ....user.model.user import User
from .....extensions import db

from ....utils.service.predefined_service import get_all_entities
from ....user.service.user_service import get_user_by_username
from ....user.model.role import Role
from sqlalchemy import func


from flask_restx import abort

# import pdfkit
from flask import current_app
from ....user.model.role import Role
from sqlalchemy import func, desc
from sqlalchemy.orm import aliased
from sqlalchemy import exists
from app.main.user.model.role import Role
from app.main.user.model.role import user_roles
from flask import Flask, render_template

import pandas as pd
from datetime import datetime
import os
from ....utils.service.document_service import (
    set_directory_permissions_recursively,
    set_file_permissions,
)
from sqlalchemy import and_, or_

from ....utils.model.predefined_master import PredefinedMaster

from ....user.model.user_address import UserAddress

# from num2words import num2words
from sqlalchemy import func, cast, Date


def check_user_order_qty(user):
    # checks the quantity ordered in order items and total quantity in cart. If quantity exceeds 2 then throw error
    cart_items = get_cart_list({"is_user": True, "is_wishList": False}, user)
    cart_item_sum = sum(
        cart_item.item_quantity
        for cart_item in cart_items
        if cart_item.product is not None
    )

    # order_items_sum = (
    #     db.session.query(func.sum(OrderItem.item_quantity))
    #     .filter(OrderItem.order.has(user_id=user.id))
    #     .where(OrderItem.is_delete == "N", OrderMaster.is_delete == "N")
    #     .scalar()
    #     or 0
    # )
    oi = aliased(OrderItem)
    om = aliased(OrderMaster)

    # Perform the query using SQLAlchemy ORM
    order_items_sum = (
        db.session.query(func.sum(oi.item_quantity).label("sum_1"))
        .filter(
            exists().where(
                and_(
                    oi.order_id == om.order_id,
                    om.user_id == user.id,
                    oi.is_delete == "N",
                    om.is_delete == "N",
                    oi.product_id != None,
                    ~om.approval_status.has(code=ORDER_STATUS_REJECTED),
                    ~om.status.has(code=ORDER_CANCELLED),
                )
            )
        )
        .scalar()
        or 0
    )
    # if cart_item_sum > 2:
    #     return {
    #         "message": "You cannot add more than 2 quantities.",
    #         "error": "You cannot add more than 2 quantities.",
    #     }, 400

    total_qty = cart_item_sum + order_items_sum

    return total_qty, cart_item_sum


def save_order(order):
    if order.get("vehicle_id") is None:
        abort(400, error="Please Add Vehicle")
    order["payment_status_id"] = (
        db.session.query(PredefinedMaster.predefined_id)
        .filter_by(code="UNPAID")
        .scalar()
        or 0
    )
    payment_id = order.get("payment_id")
    if payment_id is not None:
        payment = PaymentTransaction.query.filter(
            PaymentTransaction.order_id == payment_id
        ).first()
        payment.order_status = "SUCCESS"
        db.session.add(payment)
        db.session.commit()
        order["payment_status_id"] = (
            db.session.query(PredefinedMaster.predefined_id)
            .filter_by(code="PAID")
            .scalar()
            or 0
        )

    company_user_admin = None
    current_user = get_jwt_identity()
    user = get_user_by_username(username=current_user)
    total_qty, cart_item_sum = check_user_order_qty(user=user)

    company_user = CompanyUser.query.filter_by(user_id=user.id).first()

    if company_user != None:
        company_user_admin = (
            CompanyUser.query.join(User.roles)
            .filter(
                Role.code == "ROLE_CORPORATE_ADMIN",
                CompanyUser.company_id == company_user.company_id,
            )
            .first()
        )
    if company_user:
        index = company_user.company.website.find("abbott.com")
        if index != -1:
            if cart_item_sum > 2:
                return {
                    "message": "You cannot add more than 2 quantities.",
                    "error": "You cannot add more than 2 quantities.",
                }, 400
            if total_qty > 2:
                return {
                    "message": "You have placed 2 orders before this and are not allowed to place more orders",
                    "error": "You have placed 2 orders before this and are not allowed to place more orders",
                }, 400
    cart_items = get_cart_list({"is_user": True, "is_wishList": False}, user)
    service_point_user = (
        ServiceUser.query.join(User.roles)
        .filter(
            Role.code == "SP_USER_ADMIN",
            ServiceUser.service_point_id == order["service_point_id"],
        )
        .first()
    )
    if len(cart_items) == 0:
        return {"message": "Cart is empty", "error": "Cart is empty"}, 400

    # Retrieve the current user identity from the JWT token
    # Setting Order master
    new_order = OrderMaster(
        service_point_id=order["service_point_id"],
        user=get_user_by_id(order["user_id"]),
        shipping_address_id=(
            order["shipping_address_id"]
            if "shipping_address_id" in order and order["shipping_address_id"] != ""
            else None
        ),
        billing_address_id=(
            order["billing_address_id"]
            if "billing_address_id" in order and order["billing_address_id"] != ""
            else None
        ),
        is_use_wallet=order.get("is_use_wallet"),
        service_start_date=order["service_start_date"],
        service_start_time_id=order.get("service_start_time_id", None),
        vehicle_id=order["vehicle_id"],
        company_id=company_user.company_id if company_user != None else None,
        company_user_id=(
            company_user_admin.company_user_id if company_user != None else None
        ),
        sp_user_id=(
            (service_point_user.service_user_id if service_point_user != None else None)
            if service_point_user != None
            else None
        ),
        payment_status_id=order.get("payment_status_id"),
        department_id=company_user.department_id if company_user != None else None,
    )
    if new_order.vehicle_id is None:
        abort(400, error="Vehicle not Found")
    # new_order.created_by_user=user.id
    new_order.status_id = get_predefined_by_type_and_code("ORDER-STATUS", "PENDING")[
        0
    ].predefined_id
    new_order.approval_status_id = get_predefined_by_type_and_code(
        "APPROVAL-STATUS", "PENDING"
    )[0].predefined_id
    db.session.add(new_order)
    db.session.flush()  # Flush to get the order_id
    new_order.mechmiles_staff_id = None
    status = get_predefined_by_type_and_code("STAFF-ASSIGNED-STATUS", "UNASSIGNED")
    new_order.assigned_status_id = status[0].predefined_id
    if company_user is not None:
        new_order.is_use_wallet = True
    sum = 0
    product_sum = 0
    purchase_sum = 0
    product_gst = 0
    product_amount = 0
    for cart_item in cart_items:
        # company_price = CompanyPrice.query.filter_by(company_id=company_user.company_id, product_id=cart_item.product_id).first().price
        # company_price = CompanyPrice.query.filter_by(company_id=company_user.company_id, product_id=cart_item.product_id).first().price
        order_item = OrderItem()
        order_item.conver_cart_item_to_order_item(cart_item=cart_item)
        if cart_item.product is not None:
            if cart_item.product.product_gst is not None:
                # product_gst += round(
                #     cart_item.product.product_gst * cart_item.item_quantity, 2
                # )
                # gst = round(cart_item.product.product_gst * cart_item.item_quantity, 2)
                order_item.amount = round(
                    order_item.total_amount
                    * 100
                    / (100 + cart_item.product.product_gst),
                    2,
                )
                order_item.tax = round(order_item.total_amount - order_item.amount, 2)
                product_gst += order_item.tax
                product_amount += order_item.amount
            else:

                # gst = round(PRODUCT_GST * cart_item.item_quantity, 2)
                order_item.amount = round(
                    order_item.total_amount * 100 / (100 + PRODUCT_GST), 2
                )
                order_item.tax = round(order_item.total_amount - order_item.amount, 2)
                product_gst += order_item.tax
                product_amount += order_item.amount
        else:
            # product_gst += round(SERVICE_GST * cart_item.item_quantity, 2)
            # gst = round(SERVICE_GST * cart_item.item_quantity, 2)
            order_item.amount = round(
                order_item.total_amount * 100 / (100 + SERVICE_GST), 2
            )
            order_item.tax = round(order_item.total_amount - order_item.amount, 2)
            product_gst += order_item.tax
            product_amount += order_item.amount

        order_item.order_id = new_order.order_id
        order_item.department_id = (
            company_user.department_id if company_user != None else None
        )
        if cart_item.item_quantity is not None:
            sum += cart_item.total_amount * cart_item.item_quantity
            product_sum += order_item.base_price * cart_item.item_quantity
            purchase_sum += order_item.product_purchase_price * cart_item.item_quantity
        else:
            sum += cart_item.total_amount
        db.session.add(order_item)
        db.session.flush()
    new_order.tax = round(product_gst, 2)
    new_order.amount = round(product_amount, 2)
    # if product_gst is not None and product_gst != 0:
    #     new_order.amount = round(sum * 100 / (100 + product_gst), 2)
    # else:
    #     new_order.amount = round(sum * 100 / (100 + SERVICE_GST), 2)
    # new_order.tax = round(sum - new_order.amount, 2)
    new_order.payable_amount = sum
    new_order.total_amount = sum
    new_order.purchase_amount = purchase_sum
    new_order.product_amount = product_sum

    code = order.get("code", None)
    if code and code != "":
        res = apply_coupon({"code": code, "user_id": user.id, "amount": sum})
        new_order.coupon_code = code
        discount = res.get("discount", None)
        if discount:
            total_sum = 0
            new_order.coupon_discount = discount
            if discount > new_order.total_amount:
                total_sum = 0
            elif new_order.amount > 0:
                total_sum = new_order.total_amount - discount
            else:
                total_sum = new_order.total_amount

            # new_order.amount = round(total_sum * 100 / (100 + PRODUCT_GST), 2)
            # new_order.tax = round(total_sum - new_order.amount, 2)
            new_order.payable_amount = total_sum

        coupon_id = res.get("coupon_id", None)
        if coupon_id:
            new_order.coupon_id = coupon_id
    if new_order.is_use_wallet is not None and new_order.is_use_wallet:
        payment_status_id = (
            db.session.query(PredefinedMaster.predefined_id)
            .filter_by(code="PAID")
            .scalar()
            or 0
        )
        new_order.payment_status_id = payment_status_id
        # amount = cal_credit_history(order.service_point_id)
        company_user = CompanyUser.query.filter_by(user_id=new_order.user_id).first()
        if company_user != None:
            if company_user.company.wallet_amount is None or (
                company_user.company.wallet_amount is not None
                and company_user.company.wallet_amount < new_order.payable_amount
            ):

                db.session.rollback()
                return {
                    "message": "Insufficient  amount",
                    "error": "Insufficient  amount",
                }, 400
        if company_user is None:
            bal = cal_wallet_history(data={"user_id": new_order.user_id})
            if (
                bal is not None
                and bal.get("balance") is not None
                and bal.get("balance") < new_order.payable_amount
            ):
                # service_point = new_order.service_point
                wallet_history = create_wallet_history(
                    wallet_history_data=WalletHistory(
                        user_id=new_order.user_id,
                        amount=bal.get("balance"),
                        transaction_type="DEBIT",
                        title="Redeem for Order",
                        order_id=new_order.order_id,
                    )
                )
                new_order.wallet_discount = bal.get("balance")
                new_order.paid_amount = 0
            else:
                wallet_history = create_wallet_history(
                    wallet_history_data=WalletHistory(
                        user_id=new_order.user_id,
                        amount=new_order.payable_amount,
                        transaction_type="DEBIT",
                        title="Redeem for Order",
                        order_id=new_order.order_id,
                    )
                )
                new_order.wallet_discount = new_order.payable_amount
            # new_order.payment_status_id = (
            #     db.session.query(PredefinedMaster.predefined_id)
            #     .filter_by(code="PAID")
            #     .scalar()
            #     or 0
            # )
            # db.session.add(wallet_history)
            new_order.paid_amount = 0
    if company_user is None:
        new_order.approval_status_id = get_predefined_by_type_and_code(
            "APPROVAL-STATUS", "APPROVED"
        )[0].predefined_id
    db.session.add(new_order)
    # Commit the changes to the database
    db.session.flush()  # Flush to get the order_id

    CartItem.query.filter(CartItem.created_by_id == user.id).update(dict(is_delete="Y"))
    db.session.commit()
    order_id = new_order.order_id

    if company_user is None:
        url_pdf, pdf = order_invoice(order_id)
        send_notification(
            template_code="ORDER-PLACED",
            model={"order_id": order_id},
            user_id=[new_order.user_id],
            entity_type="CUSTOMER",
        )

        if new_order.user is not None:
            data = {
                "name": new_order.user.full_name,
                "order_id": new_order.order_id,
            }
            email = new_order.user.email
        email_content = render_template("order_place.html", data=data)
        if email is not None:
            send_email_with_attachment(
                subject="Order Placed Successfully",
                recipient=[email],
                body=email_content,
                # attachment=pdf,
            )
    return {"message": "Order successfully saved"}, 201


def get_orders(order):
    page = order.get("page_number")
    per_page = order.get("page_size")
    query = OrderMaster.query
    query = query.filter_by(is_delete="N")
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    # loaded_data, errors = result
    query = get_query_criteria(order, query)

    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    query = query.order_by(desc(OrderMaster.order_id))
    # Group by columns used in the ORDER BY clause
    query = query.group_by(OrderMaster.order_id)

    if page is not None and per_page is not None:
        # total_count = query.with_entities(func.count()).scalar()

        query = query.limit(per_page)  # Apply LIMIT based on per_page
        if page >= 1:
            offset = (page - 1) * per_page
            query = query.offset(offset)  # Apply OFFSET based on page_number

        current_app.logger.info(
            "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
        )
        # return query
        # return query.items
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )

    order = query.all()
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    return order


def get_order_by_id(order_id):
    admin_role_id = Role.get_role_by_code(ROLE_CORPORATE_ADMIN).id
    sp_role_admin_id = Role.get_role_by_code(ROLE_SP_ADMIN).id
    order = OrderMaster.query.get(order_id)
    # user_roles_alias = aliased(UserRole)
    query = (
        db.session.query(CompanyUser)
        .outerjoin(user_roles, user_roles.c.user_id == CompanyUser.user_id)
        .outerjoin(User, User.id == CompanyUser.user_id)
        .filter(CompanyUser.company_id == order.company_id)
        .filter(User.is_delete == "N")
        .filter(user_roles.c.role_id == admin_role_id)
        .first()
    )

    # current_app.logger.info("gddggdgdg", format(query))
    sp_query = (
        ServiceUser.query.outerjoin(
            user_roles, user_roles.c.user_id == ServiceUser.user_id
        )
        .filter(ServiceUser.service_point_id == order.service_point_id)
        .filter(user_roles.c.role_id == sp_role_admin_id)
        .first()
    )

    if query is not None:
        order.admin_user = query.user
        order.admin_user_dept = query.department
    if sp_query is not None:
        order.service_point_user = sp_query.user
    return order


def get_orders_count(order):
    query = OrderMaster.query
    # loaded_data, errors = result
    query = query.filter_by(is_delete="N")
    query = get_query_criteria(order, query)
    query = query.group_by(OrderMaster.order_id)
    return {"data": query.count()}

    query = OrderMaster.query
    # loaded_data, errors = result
    query = query.filter_by(is_delete="N")
    query = get_query_criteria(order, query)
    return {"data": query.count()}


def get_query_criteria(order, query):

    is_admin = order.get("is_admin_dashboard")

    if order.get("search_by"):
        User_order = aliased(User)
        User_staff = aliased(User)

        query = (
            query.join(User_order, User_order.id == OrderMaster.user_id)
            .outerjoin(User_staff, User_staff.id == OrderMaster.mechmiles_staff_id)
            .join(OrderItem, OrderItem.order_id == OrderMaster.order_id)
            .join(ProductMaster, ProductMaster.product_id == OrderItem.product_id)
        )
        search_by = order.get("search_by")
        query = query.filter(
            db.or_(
                db.func.cast(OrderMaster.order_id, db.String).ilike(f"%{search_by}%"),
                db.func.lower(User_order.full_name).ilike(f"%{search_by}%"),
                db.func.lower(ProductMaster.product_name).ilike(f"%{search_by}%"),
                db.func.lower(User_order.phone).ilike(f"%{search_by}%"),
                db.func.lower(User_order.email).ilike(f"%{search_by}%"),
                db.func.lower(User_staff.full_name).ilike(f"%{search_by}%"),
                db.func.lower(User_staff.phone).ilike(f"%{search_by}%"),
                db.func.lower(User_staff.email).ilike(f"%{search_by}%"),
            )
        )
    if is_admin is not None and is_admin:
        query = query.filter(~OrderMaster.status.has(code=ORDER_CANCELLED)).filter(
            ~OrderMaster.approval_status.has(code=ORDER_STATUS_REJECTED)
        )
    if order.get("is_custom"):
        query = query.filter(OrderMaster.is_custom == order.get("is_custom"))
    if order.get("assigned_status_id"):
        query = query.filter(
            OrderMaster.assigned_status_id == order.get("assigned_status_id")
        )
    if order.get("user_id"):
        query = query.filter(OrderMaster.user_id == order.get("user_id"))
        current_app.logger.info(
            "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
        )

    if order.get("email"):
        query = query.filter(OrderMaster.user.has(email=order.get("email")))

    if order.get("department_id"):
        query = query.filter(OrderMaster.department_id == order.get("department_id"))

    if order.get("company_id"):
        query = query.filter(OrderMaster.company_id == order.get("company_id"))
        current_app.logger.info(
            "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
        )
    if order.get("is_stats"):
        query = query.filter(
            ~OrderMaster.status.has(code=ORDER_CANCELLED),
        )
    if order.get("unassigned_staff"):
        query = query.filter(
            ~OrderMaster.status.has(code=ORDER_CANCELLED),
            OrderMaster.mechmiles_staff == None,
        )
    if (
        "start_date" in order
        and "end_date" in order
        and order.get("start_date") != None
        and order.get("end_date")
    ):
        start_date = is_date(order["start_date"])
        end_date = is_date(order["end_date"])
        # Range filter if both start_date and end_date exist
        query = query.filter(
            and_(
                cast(OrderMaster.created_at, Date) >= start_date.date(),
                cast(OrderMaster.created_at, Date) <= end_date.date(),
            )
        )
    elif "start_date" in order and order.get("start_date") != None:
        # Filter for a particular date if start_date exists
        query = query.filter(OrderMaster.created_at == order["start_date"])

    if order.get("status_id"):
        query = query.filter(OrderMaster.status_id == order.get("status_id"))

    if order.get("approval_status_id"):
        query = query.filter(
            OrderMaster.approval_status_id == order.get("approval_status_id")
        )
    if order.get("payment_status_id"):
        query = query.filter(
            OrderMaster.payment_status_id == order.get("payment_status_id")
        )

    # if order.get("search_by"):
    #     search_by = order.get("search_by")
    #     query = query.filter(
    #         db.or_(
    #             db.func.cast(OrderMaster.order_id, db.Text).ilike(f"%{search_by}%"),
    #             db.func.lower(User.full_name).ilike(f"%{search_by}%"),
    #             db.func.lower(User.phone).ilike(f"%{search_by}%"),
    #             db.func.lower(User.email).ilike(f"%{search_by}%"),
    #         )
    #     )
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    return query


def is_date(input_str):
    try:
        # Try parsing as date format
        date = datetime.strptime(input_str, "%Y-%m-%d")
        return date

    except ValueError:
        try:
            # Try parsing as datetime format
            date = datetime.strptime(input_str, "%Y-%m-%dT%H:%M:%S.%fZ")
            return date
        except ValueError:
            return False


def update_order(order_id, updated_order_data):
    # Retrieve the order by its ID
    order = OrderMaster.query.get(order_id)

    if order:
        # Update the order using the update_order method
        order.update_order(updated_order_data)
        return {"message": "Order successfully updated"}, 200
    else:
        return {"message": "Order not found"}, 404


def get_order_stats(order):
    total_order_count = get_orders_count({"company_id": order.get("company_id")})
    pending_query = OrderMaster.query.filter(
        OrderMaster.approval_status.has(code="PENDING"), OrderMaster.is_delete == "N"
    )
    pending_query = get_query_criteria(order, pending_query)
    pending_approval = pending_query.count()

    rejected_query = OrderMaster.query.filter(
        OrderMaster.approval_status.has(code="REJECTED"), OrderMaster.is_delete == "N"
    )
    rejected_query = get_query_criteria(order, rejected_query)
    rejected_approval = rejected_query.count()

    inprogress_query = OrderMaster.query.filter(
        OrderMaster.approval_status.has(code="INPROGRESS"), OrderMaster.is_delete == "N"
    )
    inprogress_query = get_query_criteria(order, inprogress_query)
    inprogress_approval = inprogress_query.count()

    accepted_query = OrderMaster.query.filter(
        OrderMaster.approval_status.has(code="APPROVED"), OrderMaster.is_delete == "N"
    )
    accepted_query = get_query_criteria(order, accepted_query)
    accepted_approval = accepted_query.count()

    pending_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="PENDING"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    )
    pending_query = get_query_criteria(order, pending_query)
    pending_order = pending_query.count()

    rejected_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="REJECTED"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    )
    rejected_query = get_query_criteria(order, rejected_query)
    rejected_order = rejected_query.count()

    inprogress_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="INPROGRESS"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    )
    inprogress_query = get_query_criteria(order, inprogress_query)
    inprogress_order = inprogress_query.count()

    accepted_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="COMPLETED"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    )
    accepted_query = get_query_criteria(order, accepted_query)
    accepted_order = accepted_query.count()

    total_order_amount_query = OrderMaster.query.filter(
        OrderMaster.is_delete == "N"
    ).with_entities(func.sum(OrderMaster.payable_amount))
    total_order_amount_query = get_query_criteria(order, total_order_amount_query)
    total_order_amount = total_order_amount_query.scalar() or 0

    pending_approval_amount_query = OrderMaster.query.filter(
        OrderMaster.approval_status.has(code="PENDING"), OrderMaster.is_delete == "N"
    ).with_entities(func.sum(OrderMaster.amount))
    pending_approval_amount_query = get_query_criteria(
        order, pending_approval_amount_query
    )
    pending_approval_amount = pending_approval_amount_query.scalar() or 0

    cancelled_amount_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="CANCELLED"), OrderMaster.is_delete == "N"
    ).with_entities(func.sum(OrderMaster.amount))
    cancelled_amount_query = get_query_criteria(order, cancelled_amount_query)
    cancelled_amount = cancelled_amount_query.scalar() or 0

    accepted_approval_amount_query = OrderMaster.query.filter(
        OrderMaster.approval_status.has(code="APPROVED"), OrderMaster.is_delete == "N"
    ).with_entities(func.sum(OrderMaster.amount))
    accepted_approval_amount_query = get_query_criteria(
        order, accepted_approval_amount_query
    )
    accepted_approval_amount = accepted_approval_amount_query.scalar() or 0

    pending_order_amount_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="PENDING"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    ).with_entities(func.sum(OrderMaster.amount))
    pending_order_amount_query = get_query_criteria(order, pending_order_amount_query)
    pending_order_amount = pending_order_amount_query.scalar() or 0

    cancelled_order_amount_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="CANCELLED"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    ).with_entities(func.sum(OrderMaster.amount))
    cancelled_order_amount_query = get_query_criteria(
        order, cancelled_order_amount_query
    )
    cancelled_order_amount = cancelled_order_amount_query.scalar() or 0

    accepted_order_amount_query = OrderMaster.query.filter(
        OrderMaster.status.has(code="COMPLETED"),
        OrderMaster.approval_status.has(code="APPROVED"),
        OrderMaster.is_delete == "N",
    ).with_entities(func.sum(OrderMaster.amount))
    accepted_order_amount_query = get_query_criteria(order, accepted_order_amount_query)
    accepted_order_amount = accepted_order_amount_query.scalar() or 0

    return {
        "total_order": total_order_count["data"],
        "pending_approval": pending_approval,
        "rejected_approval": rejected_approval,
        "accepted_approval": accepted_approval,
        "inprogress_approval": inprogress_approval,
        "pending_order": pending_order,
        "rejected__order": rejected_order,
        "accepted_order": accepted_order,
        "inprogress_order": inprogress_order,
        "total_order_amount": total_order_amount,
        "pending_approval_amount": pending_approval_amount,
        "cancelled_amount": cancelled_amount,
        "accepted_approval_amount": accepted_approval_amount,
        "pending_order_amount": pending_order_amount,
        "cancelled_order_amount": cancelled_order_amount,
        "accepted_order_amount": accepted_order_amount,
    }


def change_approval_order_status(order, status_code):
    order = OrderMaster.query.filter_by(order_id=order["order_id"]).first()
    predefined = get_predefined_by_type_and_code("APPROVAL-STATUS", status_code)[0]
    if status_code == "APPROVED":
        if order.is_use_wallet:
            company_user = CompanyUser.query.filter_by(user_id=order.user_id).first()
            if company_user != None:
                if company_user.company.wallet_amount is None or (
                    company_user.company.wallet_amount is not None
                    and company_user.company.wallet_amount < order.total_amount
                ):
                    db.session.rollback()
                    return {
                        "message": "Insufficient  amount",
                        "error": "Insufficient  amount",
                    }, 400

                company = company_user.company
                company.wallet_amount = company.wallet_amount - order.payable_amount
                wallet_history = create_wallet_history(
                    wallet_history_data=WalletHistory(
                        user_id=order.user_id,
                        amount=order.payable_amount,
                        transaction_type="DEBIT",
                        company_id=company.company_id,
                        title="Redeem for Order",
                        order_id=order.order_id,
                    )
                )
                # db.session.add(wallet_history)
                db.session.add(company)
                order.wallet_discount = order.payable_amount
                # url_pdf, pdf = order_invoice(order.order_id)
                if order.user is not None:
                    data = {
                        "name": order.user.full_name,
                        "order_id": order.order_id,
                    }
                    email = order.user.email
                # email_content = render_template("order_place.html", data=data)
                # if email is not None:
                # send_email_with_attachment(
                #     subject="ORDER APPROVED ",
                #     recipient=email,
                #     body=email_content,
                #     attachment=pdf,
                # )
    else:
        send_notification(
            template_code="ORDER-REJECTED",
            model={"order_id": order.order_id},
            user_id=[order.user_id],
            entity_type="CUSTOMER",
        )
        model = {"order_id": order.order_id}
        if order.user is not None:
            email = order.user.email
        if email is not None:
            send_mail(
                template_code="ORDER-REJECTED-MAIL",
                model=model,
                recipient=[email],
            )
    order.approval_status = predefined
    order.approval_status_id = predefined.predefined_id
    if order.reject_reason is not None:
        order.reject_reason = order["reject_reason"]
    db.session.add(order)
    db.session.commit()
    return {"message": "Status successfully changed."}, 200


def change_order_status(order, status_code):
    order = OrderMaster.query.filter_by(order_id=order["order_id"]).first()
    predefined = get_predefined_by_type_and_code("ORDER-STATUS", status_code)[0]

    if status_code == "CANCELLED":
        if order.status.code != status_code:
            if order.total_amount is not None:
                wallet_history = create_wallet_history(
                    wallet_history_data=WalletHistory(
                        user_id=order.user_id,
                        company_id=order.company_id,
                        amount=order.payable_amount,
                        transaction_type="CREDIT",
                        title="Refund for Order",
                        order_id=order.order_id,
                    )
                )
                if order.company_id is not None:
                    order.company.wallet_amount += order.total_amount

            send_notification(
                template_code="ORDER-CANCELLED",
                model={"order_id": order.order_id},
                user_id=[order.user_id],
                entity_type="CUSTOMER",
            )
            model = {"order_id": order.order_id}
            if order.user is not None:
                email = order.user.email
                if email is not None:
                    send_mail(
                        template_code="ORDER-CANCELLED-MAIL",
                        model=model,
                        recipient=[email],
                    )
    elif status_code == "COMPLETED":
        url_pdf, pdf = order_invoice(order.order_id)
        if order.user is not None:
            email = order.user.email
        if order.user is not None:
            data = {
                "name": order.user.full_name,
                "order_id": order.order_id,
            }
            email = order.user.email
            email_content = render_template("order-complete.html", data=data)
            cc_mail = current_app.config["CC_MAIL"]
            if cc_mail is not None:
                cc_list = cc_mail.split(",")

            if email is not None:
                send_email_with_attachment(
                    subject="Order Completed Successfully",
                    recipient=[email],
                    body=email_content,
                    attachment=pdf,
                    cc=cc_list,
                )
    order.status = predefined
    order.status_id = predefined.predefined_id
    db.session.add(order)
    db.session.commit()


def order_invoice(order_id):
    try:
        order_master = OrderMaster.query.get_or_404(order_id)
        if order_master.invoice_url is not None and order_master.invoice_url != "":
            return order_master.invoice_url, order_master.invoice_path
        else:
            data = {}

            data["sp_address"] = (
                order_master.service_point.city.name
                if order_master.service_point.city
                else (
                    None + "," + order_master.service_point.state.name
                    if order_master.service_point.state
                    else None
                )
            )
            data["sp_name"] = order_master.service_point.service_point_name
            data["order_id"] = order_master.order_id
            data["email"] = order_master.user.email
            if order_master.company is not None:
                company_user = CompanyUser.query.filter_by(
                    company_id=order_master.company.company_id
                ).first()
                if company_user != None:
                    data["company_address"] = (
                        company_user.department.billing_address
                        if company_user.department is not None
                        else None
                    )
                data["organization_name"] = order_master.company.organization_name
                data["company_id"] = order_master.company.company_id
            if order_master.department is not None:
                data["gst_in"] = order_master.department.gstin
            data["created_at"] = order_master.created_at.strftime("%d-%m-%Y")
            if order_master.billing_address:
                concatenated_address = ", ".join(
                    filter(
                        None,
                        [
                            order_master.billing_address.detail_address,
                            order_master.billing_address.street_address,
                            order_master.billing_address.landmark,
                            order_master.billing_address.pincode,
                            (
                                order_master.billing_address.city.name
                                if order_master.billing_address.city
                                else None
                            ),
                            (
                                order_master.billing_address.state.name
                                if order_master.billing_address.state
                                else None
                            ),
                            (
                                order_master.billing_address.country.name
                                if order_master.billing_address.country
                                else None
                            ),
                        ],
                    )
                )
                data["customer_address"] = (
                    concatenated_address if concatenated_address else None
                )
            data["customer_name"] = order_master.user.full_name
            data["phone"] = order_master.user.phone
            data["service_date"] = order_master.service_start_date

            data["address"] = order_master.user.phone
            data["sub_total"] = order_master.amount
            data["discount"] = order_master.coupon_discount
            data["gst"] = order_master.tax
            data["total_amount"] = order_master.payable_amount
            words = num2words(order_master.payable_amount)
            data["total_in_words"] = words.title()
            # data["total_in_words"] = " ".join(
            #     word.capitalize() for word in words.split()
            # )

            product_data = []
            for order_item in order_master.order_from_order_item:
                products = {}
                if order_item.product is not None:
                    products["product_name"] = order_item.product.product_name
                    products["hsn_code"] = order_item.product.hsn_code

                if order_item.service is not None:
                    products["service_name"] = order_item.service.service_name

                products["quantity"] = order_item.item_quantity
                products["gst"] = order_item.tax
                products["total_amount"] = order_item.total_amount
                products["amount"] = order_item.amount
                product_data.append(products)
            data["products"] = product_data
            html_content = render_template("invoice.html", data=data)
            folder_name = "/Order/"
            invoice_name = str(order_master.order_id) + "-order.pdf"

            folder_path = current_app.config["DOCUMENT_TEMP_UPLOAD"] + folder_name
            folder_url = current_app.config["DOCUMENT_TEMP_URL"] + folder_name
            os.makedirs(folder_path, exist_ok=True)

            set_directory_permissions_recursively(folder_path)
            path_file = folder_path + invoice_name
            url_file = folder_url + invoice_name
            # config = pdfkit.configuration(
            #     wkhtmltopdf="C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe"
            # )
            config = pdfkit.configuration(wkhtmltopdf="/usr/local/bin/wkhtmltopdf")
            current_app.logger.error(f"start permission {str(path_file)}")

            # Configure PDF options
            pdf_options = {
                "page-size": "A4",
                "margin-top": "10mm",
                "margin-right": "10mm",
                "margin-bottom": "10mm",
                "margin-left": "10mm",
                "enable-local-file-access": True,
            }
            current_app.logger.error(f"start permission {str(path_file)}")

            # Generate PDF
            try:
                # Generate PDF
                pdfkit.from_string(
                    html_content, path_file, options=pdf_options, configuration=config
                )
                current_app.logger.info(f"PDF generated successfully: {path_file}")
            except Exception as e:
                current_app.logger.error(f"Error generating PDF: {e}")

            # Provide the URL for the generated PDF file
            folder_url = current_app.config["DOCUMENT_TEMP_URL"] + folder_name
            url_file = folder_url + invoice_name
            current_app.logger.info(f"PDF URL: {url_file}")
            order_master.invoice_url = url_file
            order_master.invoice_path = path_file
            db.session.add(order_master)
            db.session.commit()
            return url_file, path_file

    except Exception as e:
        current_app.logger.error(f"start permission {str(e)}")
        abort(400, error=f"failed generate invoice {e}")


def export_orders(data):
    orders = get_orders(data)
    # ... (existing logic for filters and query building)

    # Filter and format data using pandas DataFrame
    orders_df = pd.DataFrame(
        [
            {
                "Order ID": order.order_id if order.order_id else "Not Available",
                "Status": order.status.name if order.status else "Not Available",
                "Approval-Status": (
                    order.approval_status.name
                    if order.approval_status
                    else "Not Available"
                ),
                "Amount": (
                    order.payable_amount if order.payable_amount else "Not Available"
                ),
                "Item": (
                    order.total_quantity if order.total_quantity else "Not Available"
                ),
                "Employee": (order.user.full_name if order.user else "Not Available"),
                "Dept": (
                    order.department.department_name
                    if order.department
                    else "Not Available"
                ),
                "Order Date": (
                    order.created_at.strftime("%Y-%m-%d")
                    if order.created_at
                    else "Not Available"
                ),
            }
            for order in orders
        ]
    )
    folder_path = "tempFolder"

    url_path = os.path.join(current_app.config["DOCUMENT_TEMP_URL"], folder_path)

    actual_path = os.path.join(current_app.config["DOCUMENT_TEMP_UPLOAD"], folder_path)
    # Generate unique filename incorporating timestamp (add security measures as needed)
    filename = f"orders_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    full_export_path = os.path.join(actual_path, filename)
    set_directory_permissions_recursively(actual_path)
    set_file_permissions(full_export_path)
    os.makedirs(actual_path, exist_ok=True)
    url_export_path = os.path.join(url_path, filename)
    # Export to CSV with appropriate file encoding
    orders_df.to_csv(full_export_path, index=False, encoding="utf-8")
    return url_export_path


def assigned_order(order_id, staff_id):
    status = get_predefined_by_type_and_code("STAFF-ASSIGNED-STATUS", "ASSIGNED")

    # status = get_predefined_by_type_and_code(ASSIGNED_ENTITY_TYPE, ASSIGNED)
    old_order = OrderMaster.query.get_or_404(order_id)
    # staff = CompanyUser.query.filter(CompanyUser.user_id == staff_id).first()
    staff_is_exist = OrderMaster.query.filter(
        OrderMaster.mechmiles_staff_id == staff_id,
        OrderMaster.order_id != order_id,
    ).first()

    if old_order.mechmiles_staff_id == staff_id:
        old_order.mechmiles_staff_id = None
        status = get_predefined_by_type_and_code("STAFF-ASSIGNED-STATUS", "UNASSIGNED")
        old_order.assigned_status_id = status[0].predefined_id
        db.session.add(old_order)
        db.session.commit()
        return {"message": "unassigned successfully"}
    else:
        old_order.assigned_status_id = status[0].predefined_id
        old_order.mechmiles_staff_id = staff_id
        db.session.add(old_order)
        db.session.commit()
        return {"message": "assigned successfully"}


def unassigned_order(order_id):

    # status = get_predefined_by_type_and_code(ASSIGNED_ENTITY_TYPE, ASSIGNED)
    old_order = OrderMaster.query.get_or_404(order_id)

    old_order.mechmiles_staff_id = None
    status = get_predefined_by_type_and_code("STAFF-ASSIGNED-STATUS", "UNASSIGNED")
    old_order.assigned_status_id = status[0].predefined_id
    db.session.add(old_order)
    db.session.commit()
    return {"message": "unassigned successfully"}


def save_custom_order(order):
    payment_status_id = (
        db.session.query(PredefinedMaster.predefined_id).filter_by(code="PAID").scalar()
        or 0
    )
    payment_id = order.get("payment_id")
    if payment_id is not None:
        payment = PaymentTransaction.query.filter(
            PaymentTransaction.order_id == payment_id
        ).first()
        payment.order_status = "SUCCESS"
        db.session.add(payment)
        db.session.commit()
        payment_status_id = (
            db.session.query(PredefinedMaster.predefined_id)
            .filter_by(code="PAID")
            .scalar()
            or 0
        )

    # current_user = get_jwt_identity()
    user = get_user_by_id(order["user_id"])
    company_user = CompanyUser.query.filter(CompanyUser.user_id == user.id).first()
    company_id = None
    department_id = None
    if company_user is not None:
        company_id = company_user.company_id
        department_id = company_user.department_id
    new_order = OrderMaster(
        service_point_id=order["service_point_id"],
        user=get_user_by_id(order["user_id"]),
        shipping_address_id=(
            order["shipping_address_id"]
            if "shipping_address_id" in order and order["shipping_address_id"] != ""
            else None
        ),
        billing_address_id=(
            order["billing_address_id"]
            if "billing_address_id" in order and order["billing_address_id"] != ""
            else None
        ),
        service_start_date=order["service_start_date"],
        service_start_time_id=order.get("service_start_time_id", None),
        vehicle_id=order.get("vehicle_id", None),
        payment_status_id=payment_status_id,
        is_custom=True,
        company_id=company_id,
        department_id=department_id,
    )
    # new_order.created_by_user=user.id
    new_order.status_id = get_predefined_by_type_and_code("ORDER-STATUS", "PENDING")[
        0
    ].predefined_id
    new_order.approval_status_id = get_predefined_by_type_and_code(
        "APPROVAL-STATUS", "APPROVED"
    )[0].predefined_id
    db.session.add(new_order)
    db.session.flush()  # Flush to get the order_id

    sum = 0
    product_sum = 0
    purchase_sum = 0
    order_tax_total = 0
    order_total_amount = 0
    order_total = 0
    order_items = order.get("order_items")
    for order_item in order_items:
        new_order_item = OrderItem()
        new_order_item.service_id = order_item.get("service_id")
        new_order_item.order_id = new_order.order_id
        new_order_item.total_amount = order_item.get("item_price")

        if order_item.get("item_quantity") is None:
            new_order_item.item_quantity = 1
            new_order_item.qty_balance = new_order_item.item_quantity
        else:
            new_order_item.item_quantity = order_item.get("item_quantity")
            new_order_item.qty_balance = new_order_item.item_quantity

        new_order_item.amount = round(
            round(new_order_item.total_amount, 2) * 100 / (100 + SERVICE_GST),
            2,
        )
        new_order_item.tax = round(
            new_order_item.total_amount - new_order_item.amount, 2
        )

        order_tax_total += new_order_item.tax
        order_total_amount += new_order_item.amount
        order_total += new_order_item.total_amount
        # else:
        #     sum += new_order_item.total_amount
        db.session.add(new_order_item)
        db.session.flush()

    new_order.payable_amount = round(order_total, 2)
    new_order.amount = round(order_total_amount, 2)
    new_order.tax = round(order_tax_total, 2)
    new_order.total_amount = round(order_total, 2)
    new_order.purchase_amount = purchase_sum
    new_order.product_amount = product_sum

    db.session.add(new_order)
    # Commit the changes to the database
    db.session.flush()
    order_id = new_order.order_id
    if order_id is not None:
        new_appointment = convert_order_to_appointment(order=new_order)
        db.session.add(new_appointment)
        db.session.flush()
    db.session.commit()

    return {"message": "Order successfully saved"}, 201


def add_product_price(new_order_item):
    if new_order_item.item_quantity is None:
        new_order_item.item_quantity = 1
    product = ProductMaster.query.filter(
        ProductMaster.product_id == new_order_item.product_id
    ).first()
    amount = (
        product.product_offer_price
        if (product.product_offer_price != None or product.product_offer_price != 0)
        else product.product_price
    )
    new_order_item.product_purchase_price = (
        product.purchase_price if product.purchase_price is not None else 0
    )
    new_order_item.base_price = amount
    new_order_item.total_base_amount = amount * new_order_item.item_quantity
    new_order_item.total_purchase_amount = (
        new_order_item.product_purchase_price * new_order_item.item_quantity
    )

    return new_order_item


def convert_order_to_appointment(order):
    status = get_predefined_by_type_and_code(
        APPOINTMENT_ENTITY_TYPE, APPOINTMENT_PENDING
    )
    payment_status_id = get_predefined_by_type_and_code("PAYMENT-STATUS", "UNPAID")
    appointment = AppointmentMaster()  # Instantiate AppointmentMaster object
    appointment.order_id = (
        order.order_id
    )  # Assuming this is provided or generated elsewhere
    appointment.user_id = order.user_id
    appointment.payable_amount = order.payable_amount
    appointment.service_point_id = order.service_point_id
    appointment.service_start_date = order.service_start_date
    appointment.service_start_time_id = order.service_start_time_id
    appointment.tax = order.tax
    appointment.amount = order.amount
    appointment.paid_amount = order.payable_amount
    appointment.total_amount = order.total_amount
    appointment.status_id = status[0].predefined_id
    appointment.payment_status_id = payment_status_id[0].predefined_id

    appointment_items = []
    for item in order.order_items:
        appointment_item = (
            AppointmentItemsMaster()
        )  # Instantiate AppointmentItem object for each item
        appointment_item.order_item_id = item.order_item_id
        appointment_item.sp_quantity = item.item_quantity
        appointment_item.sp_price = item.amount
        appointment_items.append(appointment_item)
        item.qty_balance = 0

    appointment.appointment_items = appointment_items
    return appointment


def update_custom_order(data):
    payment_id = data.get("payment_id")
    if payment_id is not None:
        payment = PaymentTransaction.query.filter(
            PaymentTransaction.order_id == payment_id
        ).first()
        payment.order_status = "SUCCESS"
        db.session.add(payment)
        db.session.commit()
    payment_status_id = get_predefined_by_type_and_code("PAYMENT-STATUS", "PAID")
    appointment_id = data.get("appointment_id")
    order_tax_total = 0
    order_total_amount = 0
    appointment = AppointmentMaster.query.get_or_404(appointment_id)
    if appointment is not None:
        current_user = get_jwt_identity()
        user = get_user_by_username(username=current_user)
        order = OrderMaster.query.filter(
            OrderMaster.order_id == appointment.order_id
        ).first()
        if order is not None:
            service_point = ServicePoint.query.filter(
                ServicePoint.service_point_id == appointment.service_point_id
            ).first()
            sp_percent = service_point.sp_percent
            if order.total_amount is None:
                order.total_amount = 0
            sp_amount, mechmiles_amount = calculate_amount_with_percentage(
                data.get("amount") + order.total_amount, sp_percent
            )
            order.mechmile_earn = mechmiles_amount
            order.sp_earn = sp_amount
            order.total_amount = mechmiles_amount
            order.payment_status_id = payment_status_id[0].predefined_id
            order.payable_amount = mechmiles_amount
            for order_item in order.order_items:
                order_item.amount = round(
                    round(mechmiles_amount, 2) * 100 / (100 + SERVICE_GST),
                    2,
                )
                order_item.tax = round(mechmiles_amount - order_item.amount, 2)
                order_item.total_amount = mechmiles_amount
                order_tax_total += order_item.tax
                order_total_amount += order_item.amount
                db.session.add(order_item)
                db.session.commit()
            order.tax = order_tax_total
            order.amount = order_total_amount
            db.session.add(order)
            db.session.commit()
            for item in appointment.appointment_items:
                item.sp_price = sp_amount
                item.comments = data.get("comments")
                db.session.add(item)
                db.session.commit()
            appointment.amount = round(
                round(sp_amount, 2) * 100 / (100 + SERVICE_GST),
                2,
            )
            appointment.tax = round(sp_amount - appointment.amount, 2)
            appointment.payable_amount = sp_amount
            appointment.paid_amount = 0
            appointment.payment_status_id = payment_status_id[0].predefined_id
            appointment.total_amount = sp_amount
            db.session.add(appointment)
            db.session.commit()

        # appointment_id
        return {"message": "Order successfully saved"}, 200


def calculate_amount_with_percentage(amount, percentage):
    if percentage is not None:
        mechmiles_amount = (percentage / 100) * amount
        return (amount - mechmiles_amount), mechmiles_amount
    else:
        return amount, 0
