from sqlalchemy import func
from app.extensions import session_scope
from app.main.business.model.cart.cart_item import CartItem
from app.main.business.model.product.product_master import ProductMaster
from app.main.business.service.coupon.coupon_service import apply_coupon
from app.main.user.model.user import User


def add_cart(data, user):
    with session_scope() as session:
        cart_items = []
        product_id = data.get("product_id")
        quantity = data.get("item_quantity")
        is_wishList = data.get("is_wishList", False)

        product = None
        if product_id is not None:
            try:
                product = ProductMaster.query.get_or_404(product_id)
                product_id = product.id
            except Exception as e:
                print(f"Error fetching product: {e}")
        if is_wishList is not None and is_wishList:
            existing_cart_whisList = (
                session.query(CartItem)
                .filter_by(
                    product_id=product_id,
                    is_delete=False,
                    is_wishList=False,
                    created_by=user.id,
                )
                .first()
            )

            if existing_cart_whisList is not None:
                return existing_cart_whisList

        product_quantity = quantity
        existing_cart_item = None
        existing_service_item = None
        if product_id is not None and is_wishList is False:
            existing_cart_item = (
                session.query(CartItem)
                .filter_by(product_id=product_id, created_by=user.id, is_delete=False)
                .first()
            )
        # Use .first() to get a single result
        if product_id is not None:
            cart_items = add_product_item(
                product_id,
                existing_cart_item,
                product_quantity,
                is_wishList,
                cart_items,
                product,
                user,
                session,
            )
        # Add all CartItem instances to the database session
        # Add all CartItem instances to the database session
        session.add_all(cart_items)
        session.commit()

        return {"message": "Successfully"}


def add_product_item(
    product_id,
    existing_cart_item,
    product_quantity,
    is_wishList,
    cart_items,
    product,
    user,
    session,
):

    if product_id is not None:

        product_amount = (
            product.offer_price
            if (product.offer_price != None or product.offer_price != 0)
            else product.price
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

            new_cart_item = CartItem(
                product_id=product_id,
                item_quantity=product_quantity,
                product_price=product_amount,
                total_amount=product_amount,
                total_amount_with_qty=product_amount * product_quantity,
                created_by=user.id,
                is_wishList=is_wishList,
            )

            cart_items.append(new_cart_item)
    return cart_items


from flask_restx import abort


def remove_cart(data, user):
    cart_item_id = data.get("cart_item_id")
    is_wishList = data.get("is_wishList")

    with session_scope() as session:
        # Query using session
        existing_cart_item = (
            session.query(CartItem).filter_by(cart_item_id=cart_item_id).first()
        )

        if not existing_cart_item:
            return {"message": "Cart item not found"}, 404

        existing_cart_item.modified_by = user.id

        if existing_cart_item.item_quantity == 1:
            existing_cart_item.is_delete = True
        else:
            existing_cart_item.item_quantity -= 1
            existing_cart_item.total_amount_with_qty = (
                existing_cart_item.total_amount * existing_cart_item.item_quantity
            )
            if is_wishList is not None:
                existing_cart_item.is_wishList = is_wishList

        session.add(existing_cart_item)  # Optional; flush() would also work
        # session.commit() is handled by session_scope()
        return {"message": "Removed Successfully"}


def get_cart_list(data, user):

    page = data.get("page", None)
    per_page = data.get("per_page", None)
    query = CartItem.query.filter_by(is_delete="N")
    user_id = user.id
    is_wishlist = data.get("is_wishList", None)
    if user_id:
        query = query.filter(CartItem.created_by == user_id)
    if is_wishlist is not None:
        query = query.filter(CartItem.is_wishList == is_wishlist)
    if page is not None and per_page is not None:
        cart = query.paginate(page=page, per_page=per_page)
    else:
        cart = query.all()
    count = query.count()

    return cart


def move_item_to_wishlist(cart_item_id):
    with session_scope() as session:
        # Fetch the cart item to move
        old_cart = session.query(CartItem).filter_by(cart_item_id=cart_item_id).first()
        if not old_cart:
            return {"error": "Cart item not found"}, 404

        # Check if the product already exists in the wishlist (excluding current item)
        existing_wishlist_item = (
            session.query(CartItem)
            .filter(
                CartItem.created_by_id == old_cart.created_by_id,
                CartItem.product_id == old_cart.product_id,
                CartItem.cart_item_id != old_cart.cart_item_id,
                CartItem.is_wishList == True,
                CartItem.is_delete == False,
            )
            .first()
        )

        if existing_wishlist_item:
            # Mark the old cart item as deleted
            old_cart.is_delete = True
            session.add(old_cart)
            session.commit()
            return {"message": "Cart updated successfully"}
        else:
            # Move the item to wishlist
            old_cart.is_wishList = True
            session.add(old_cart)
            session.commit()
            return {"message": "Item moved to wishlist"}

    old_cart.is_wishList = True
    # Commit changes to the database
    session.add(old_cart)
    session.commit()

    return {"message": "cart update successfully"}


def get_total_cart_item_qty(user):
    total_quantity = (
        CartItem.query.filter_by(created_by=user.id, is_wishList=False)
        .with_entities(func.sum(CartItem.item_quantity))
        .scalar()
        or 0
    )
    return {"total_quantity": total_quantity}


def remove_item(cart_item_id, user):
    # quantity = data.get("quantity")
    existing_cart_item = CartItem.query.filter_by(
        cart_item_id=cart_item_id
    ).first()  # Use .first() to get a single result
    existing_cart_item.modified_by = user.id
    if existing_cart_item:
        existing_cart_item.is_delete = False
    session.add(existing_cart_item)
    session.commit()


def get_cart_summary(user, code):

    existing_cart_items = (
        CartItem.query.filter_by()
        .filter(
            CartItem.created_by == user.id,
            CartItem.is_delete == "N",
            CartItem.is_wishList == False,
        )
        .all()
    )

    sum = 0
    gst = 18
    total_amount = 0
    tax = 0
    for cart_items in existing_cart_items:

        if cart_items.item_quantity is not None:
            sum += round(cart_items.total_amount * cart_items.item_quantity, 2)

            if cart_items.product is not None:
                amount = round(
                    round(cart_items.total_amount * cart_items.item_quantity, 2)
                    * 100
                    / (100 + 18),
                    2,
                )
                total_amount += amount
                tax += round(
                    round(cart_items.total_amount * cart_items.item_quantity, 2)
                    - amount,
                    2,
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

    # else:
    #     total_sum = total_sum
    return {
        "subtotal": sum,
        "gst": gst,
        "total": total_sum,
        "discount": discount,
        "total_sum": total_sum,
    }


def get_cart_summary_page_details(user_id):
    # cart_item_list = get_cart_list({"is_user":True},user=User(id=user_id))
    return get_cart_summary(user=User(id=user_id))
