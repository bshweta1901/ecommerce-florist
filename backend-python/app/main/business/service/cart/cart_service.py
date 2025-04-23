from app.main.business.product.model.product_master import ProductMaster
from ..model.cart_item import CartItem
from app import db
from flask import request
from ....user.model.user import User
from ...company.model.company_price import CompanyPrice
from ...company.model.company_user import CompanyUser
from ..coupon.coupon_service import apply_coupon
from ...service_point.model.service_user import ServiceUser
from ...service_point.model.service_point_price import ServicePointPrice
from ...service_management.model.service_master import ServiceMaster
from sqlalchemy import or_
from ...service_management.model.segment_price import SegmentPrice
from ...service_management.model.segment_master import SegmentMaster
from ...service_point.service.service_point_credit_service import cal_credit_history
from ...company.service.wallet_history_service import cal_wallet_history
from ....utils.model.predefined_master import PredefinedMaster
from ...vehicle.model.vehicle_model import Vehicle
from .util.item_constant import PRODUCT_GST, SERVICE_GST


def add_cart(data, user):
    cart_items = []
    product_id = data.get("product_id")
    service_id = data.get("service_id")
    # vehicle_id = data.get("vehicle_id")
    quantity = data.get("item_quantity")
    is_wishList = data.get("is_wishList")
    vehicle_id = data.get("vehicle_id")

    product = None
    service = None
    if product_id is not None:
        try:
            product = ProductMaster.query.get_or_404(product_id)
            product_id = product.product_id
        except Exception as e:
            print(f"Error fetching product: {e}")
    if is_wishList is not None and is_wishList:
        existing_cart_whisList = CartItem.query.filter_by(
            created_by_id=user.id,
            is_wishList=True,
            product_id=product_id,
            is_delete="N",
        ).first()
        if existing_cart_whisList is not None:
            return existing_cart_whisList

    if service_id is not None:
        try:
            service = ServiceMaster.query.get_or_404(service_id)
            service_id = service.service_id
        except Exception as e:
            print(f"Error fetching service: {e}")

    product_quantity = quantity
    existing_cart_item = None
    existing_service_item = None
    if product_id is not None and is_wishList is False:
        existing_cart_item = CartItem.query.filter(
            CartItem.product_id == product_id,
            CartItem.created_by == user,
            CartItem.is_delete == "N",
            CartItem.is_wishList == False,
        ).first()  # Use .first() to get a single result
    if service_id is not None:
        existing_service_item = CartItem.query.filter(
            CartItem.service_id == service_id,
            CartItem.created_by == user,
            CartItem.is_delete == "N",
        ).first()  # Use .first() to get a single result
    company_user = CompanyUser.query.filter_by(user_id=user.id).first()
    if product_id is not None:
        cart_items = add_product_item(
            product_id,
            existing_cart_item,
            product_quantity,
            company_user,
            is_wishList,
            cart_items,
            product,
            user,
        )
    if service_id is not None:
        cart_items = add_service_item(vehicle_id, service_id, cart_items, service, user)

    # Add all CartItem instances to the database session
    # Add all CartItem instances to the database session
    db.session.add_all(cart_items)
    db.session.commit()

    response_object = {"user_id": user, "data": data}
    if cart_items is not None:
        return cart_items[0]


def add_service_item(vehicle_id, service_id, cart_items, service, user):
    # vehicle_id = data.get("vehicle_id")
    service_price = None
    if service_id is not None:
        service_amount = (
            service.offer_price
            if (service.offer_price != None or service.offer_price != 0)
            else service.price
        )
        # Create a new CartItem instance and add it to the list
        amount = 0
        if vehicle_id is not None:
            variant_id = (
                Vehicle.query.filter(Vehicle.id == vehicle_id)
                .with_entities(Vehicle.variant_id)
                .first()
            )
            if None in variant_id:
                abort(400, "Variant is not Exist")
            segment_id = (
                db.session.query(PredefinedMaster.field4)
                .filter(PredefinedMaster.predefined_id == variant_id[0])
                .first()
            )
            if None in segment_id:
                abort(400, "Segment is not Exist")
            service_price = (
                db.session.query(SegmentPrice.price)
                .filter(
                    SegmentPrice.segment_id == int(segment_id[0]),
                    SegmentPrice.service_id == service_id,
                )
                .first()
            )
            if service_price is not None:
                amount = service_price[0]
            else:
                amount = (
                    service.offer_price
                    if (service.offer_price != None or service.offer_price != 0)
                    else service.price
                )
        new_cart_item = CartItem(
            service_id=service_id,
            item_quantity=1,
            total_amount=amount,
            total_amount_with_qty=amount,
            created_by=user,
            vehicle_id=vehicle_id,
        )

        cart_items.append(new_cart_item)
    return cart_items


def add_product_item(
    product_id,
    existing_cart_item,
    product_quantity,
    company_user,
    is_wishList,
    cart_items,
    product,
    user,
):

    if product_id is not None:

        product_amount = (
            product.product_offer_price
            if (product.product_offer_price != None or product.product_offer_price != 0)
            else product.product_price
        )
        if existing_cart_item:
            existing_cart_item.item_quantity += product_quantity
            existing_cart_item.total_amount_with_qty = (
                existing_cart_item.total_amount * existing_cart_item.item_quantity
            )
            if is_wishList:
                existing_cart_item.is_wishList = is_wishList
            cart_items.append(existing_cart_item)
        else:
            # Create a new CartItem instance and add it to the list
            amount = 0
            if company_user != None:
                if product_id is not None:
                    company_price = CompanyPrice.query.filter_by(
                        company_id=company_user.company_id, product_id=product_id
                    ).first()

                    if company_price is not None:
                        amount = company_price.price
                        # Further processing using the 'amount'
                    else:
                        amount = (
                            product.product_offer_price
                            if (
                                product.product_offer_price != None
                                or product.product_offer_price != 0
                            )
                            else product.product_price
                        )
            else:
                amount = (
                    product.product_offer_price
                    if (
                        product.product_offer_price != None
                        or product.product_offer_price != 0
                    )
                    else product.product_price
                )
            new_cart_item = CartItem(
                product_id=product_id,
                item_quantity=product_quantity,
                product_price=product_amount,
                # total_amount=product.product_price,
                total_amount=amount,
                total_amount_with_qty=amount * product_quantity,
                created_by=user,
                is_wishList=is_wishList,
            )

            cart_items.append(new_cart_item)
    return cart_items


from flask_restx import abort


def add_cart_for_service_point(data, user):
    cart_items = []
    product_id = data.get("product_id")
    quantity = data.get("item_quantity")
    is_wishList = data.get("is_wishList")
    service_point_id = data.get("service_point_id")
    if service_point_id is None:
        abort(400, error="Service Point Id Required")
    try:
        product = ProductMaster.query.get_or_404(product_id)
    except Exception as e:
        print(f"Error fetching product: {e}")

    product_id = product.product_id
    product_quantity = quantity
    existing_cart_item = CartItem.query.filter_by(
        product_id=product_id, created_by=user, is_delete="N"
    ).first()  # Use .first() to get a single result
    sp_user = ServiceUser.query.filter_by(user_id=user.id).first()
    if existing_cart_item:
        existing_cart_item.item_quantity += product_quantity
        existing_cart_item.total_amount_with_qty = (
            existing_cart_item.product.product_price * existing_cart_item.total_amount
        )
        if is_wishList:
            existing_cart_item.is_wishList = is_wishList
        cart_items.append(existing_cart_item)
    else:
        if service_point_id is not None:
            # Create a new CartItem instance and add it to the list
            amount = (
                ServicePointPrice.query.filter_by(
                    service_point_id=service_point_id, product_id=product_id
                )
                .first()
                .price
            )
        new_cart_item = CartItem(
            service_point_id=service_point_id,
            product_id=product_id,
            item_quantity=product_quantity,
            total_amount=amount,
            total_amount_with_qty=amount * product_quantity,
            created_by=user,
            is_wishList=is_wishList,
        )

        cart_items.append(new_cart_item)

        # Add all CartItem instances to the database session
        db.session.add_all(cart_items)
        db.session.commit()

    response_object = {"user_id": user, "data": data}
    return response_object


def remove_cart(data, user):
    cart_item_id = data.get("cart_item_id")
    # quantity = data.get("quantity")
    is_wishList = data.get("is_wishList")
    existing_cart_item = CartItem.query.filter_by(
        cart_item_id=cart_item_id
    ).first()  # Use .first() to get a single result
    existing_cart_item.modified_by = user
    if existing_cart_item:
        if existing_cart_item.item_quantity == 1:
            existing_cart_item.is_delete = "Y"
        else:
            existing_cart_item.item_quantity -= 1
            existing_cart_item.total_amount = existing_cart_item.total_amount
            existing_cart_item.total_amount_with_qty = (
                existing_cart_item.total_amount * existing_cart_item.item_quantity
            )
            if is_wishList:
                existing_cart_item.is_wishList = is_wishList
        db.session.add(existing_cart_item)
        db.session.commit()

    # Customize the response to include only specific fields
    response_object = {"user_id": user, "data": data}
    return {"message": "Remove Successfully"}


def get_cart_list(data, user):
    service_point_id = data.get("service_point_id", None)
    page = request.args.get("page_number", type=int)
    per_page = request.args.get("page_size", type=int)
    user_id = None
    query = CartItem.query.filter_by(is_delete="N")
    is_user = data.get("is_user")
    if user is not None:
        user_id = user.id
    if service_point_id is not None:
        query = query.filter(CartItem.service_point_id == service_point_id)
    is_wishlist = data.get("is_wishList", None)
    # if is_user:
    #     query = query.filter_by(user=user)
    if user_id:
        query = query.filter(CartItem.created_by_id == user_id)
    if is_wishlist is not None:
        query = query.filter(CartItem.is_wishList == is_wishlist)
    if page is not None and per_page is not None:
        cart = query.paginate(page=page, per_page=per_page)
    else:
        cart = query.all()

    return cart


def get_cart_list_count(data, user):

    query = CartItem.query.filter_by(is_delete="N")
    user_id = user.id
    is_wishlist = data.get("is_wishlist", False)
    # if is_user:
    #     query = query.filter_by(user=user)
    if user_id:
        query = query.filter_by(created_by_id=user_id)
    if is_wishlist is not None:
        count = query.filter_by(is_wishList=is_wishlist).count()
    else:
        count = query.count()

    return {"count": count}


def update_cart(cart_item_id, data):
    old_cart = CartItem.query.filter_by(cart_item_id=cart_item_id).first_or_404()
    is_wishList = data.get("is_wishList")
    if is_wishList is not None:
        old_cart.is_wishList = is_wishList
    # Commit changes to the database
    db.session.add(old_cart)
    db.session.commit()

    return {"message": "cart update successfully"}


def move_item_to_wishlist(cart_item_id):
    old_cart = CartItem.query.filter_by(cart_item_id=cart_item_id).first_or_404()
    # if old_cart is not None:
    #     if old_cart.is_wishList is not None and old_cart.is_wishList is True:
    #         old_cart.is_delete = "Y"
    #         db.session.add(old_cart)
    #         db.session.commit()
    #         return {"message": "Remove from Wishlist"}

    existing_cart_whisList = CartItem.query.filter_by(
        created_by_id=old_cart.created_by_id,
        is_wishList=True,
        product_id=old_cart.product_id,
        is_delete="N",
    ).first()
    if existing_cart_whisList is not None:
        old_cart.is_delete = "Y"
        db.session.add(old_cart)
        db.session.commit()
        return {"message": "cart update successfully"}

    old_cart.is_wishList = True
    # Commit changes to the database
    db.session.add(old_cart)
    db.session.commit()

    return {"message": "cart update successfully"}


def get_total_cart_item_qty(user):
    total_quantity = (
        CartItem.query.filter_by(created_by_id=user.id)
        .with_entities(db.func.sum(CartItem.item_quantity))
        .scalar()
        or 0
    )
    return {"total_quantity": total_quantity}


def remove_item(cart_item_id, user):
    # quantity = data.get("quantity")
    existing_cart_item = CartItem.query.filter_by(
        cart_item_id=cart_item_id
    ).first()  # Use .first() to get a single result
    existing_cart_item.modified_by = user
    if existing_cart_item:
        existing_cart_item.is_delete = "Y"
    db.session.add(existing_cart_item)
    db.session.commit()


def get_cart_summary(user, code, is_credit, is_wallet, sp_id):
    credit_discount = None
    wallet_discount = None
    # balance = None
    bal_amount = None
    if is_credit:
        bal = cal_credit_history(sp_id)
        if bal is not None:
            for balance in bal:
                bal_amount = balance["balance"]
    if is_wallet is not None and is_wallet:
        bal = cal_wallet_history(data={"user_id": user.id})
        if bal is not None:
            bal_amount = bal.get("balance")
    existing_cart_items = (
        CartItem.query.filter_by()
        .filter(
            CartItem.created_by_id == user.id,
            CartItem.is_delete == "N",
            CartItem.is_wishList == False,
        )
        .all()
    )

    sum = 0
    product_gst = 0
    total_amount = 0
    tax = 0
    for cart_items in existing_cart_items:
        # if(cart_items.product.discounted_price!=None):
        #     sum+=cart_items.product.product_discounted_price * cart_items.item_quantity
        # elif(cart_items.product.product_offer_price!=None):
        #     sum+=cart_items.product.product_offer_price * cart_items.item_quantity
        # elif(cart_items.product.product_price!=None):
        #     sum+=cart_items.product.product_price * cart_items.item_quantity

        if cart_items.item_quantity is not None:
            sum += round(cart_items.total_amount * cart_items.item_quantity, 2)
            if (
                cart_items.product is not None
                and cart_items.product.product_gst is not None
            ):
                # The code is calculating the amount and tax for each item in a shopping cart.
                amount = round(
                    round(cart_items.total_amount * cart_items.item_quantity, 2)
                    * 100
                    / (100 + cart_items.product.product_gst),
                    2,
                )
                total_amount += amount
                tax += round(
                    round(cart_items.total_amount * cart_items.item_quantity, 2)
                    - amount,
                    2,
                )
            else:
                if cart_items.product is not None:
                    amount = round(
                        round(cart_items.total_amount * cart_items.item_quantity, 2)
                        * 100
                        / (100 + PRODUCT_GST),
                        2,
                    )
                    total_amount += amount
                    tax += round(
                        round(cart_items.total_amount * cart_items.item_quantity, 2)
                        - amount,
                        2,
                    )
                else:
                    amount = round(
                        round(cart_items.total_amount * cart_items.item_quantity, 2)
                        * 100
                        / (100 + SERVICE_GST),
                        2,
                    )
                    total_amount += amount
                    tax += round(
                        round(cart_items.total_amount * cart_items.item_quantity, 2)
                        - amount,
                        2,
                    )
        else:
            amount = round(
                round(cart_items.total_amount, 2) * 100 / (100 + SERVICE_GST),
                2,
            )
            total_amount += amount
            tax += round(
                round(cart_items.total_amount * cart_items.item_quantity, 2) - amount, 2
            )

    total_sum = sum
    gst = tax
    sum = round(total_amount)

    discount = 0
    if code is not None and code != "null" and code:
        res = apply_coupon({"code": code, "user_id": user.id, "amount": total_sum})
        discount = res.get("discount")
        if discount:
            if discount > total_sum:
                total_sum = 0
            elif sum > 0:
                total_sum = total_sum - discount
            else:
                total_sum = sum
    if bal_amount is not None:
        if bal_amount >= total_sum:
            credit_discount = total_sum
            wallet_discount = total_sum
            total_sum -= total_sum
        else:
            credit_discount = bal_amount
            wallet_discount = bal_amount
            total_sum = total_sum - bal_amount

    # else:
    #     total_sum = total_sum
    return {
        "subtotal": sum,
        "gst": gst,
        "total": total_sum,
        "credit_discount": credit_discount,
        "wallet_discount": wallet_discount,
        "discount": discount,
        "total_sum": total_sum,
    }


def get_cart_summary_page_details(user_id):
    # cart_item_list = get_cart_list({"is_user":True},user=User(id=user_id))
    return get_cart_summary(user=User(id=user_id))
