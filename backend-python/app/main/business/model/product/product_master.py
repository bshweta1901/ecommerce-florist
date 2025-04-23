from .....extensions import db
from ....utils.model.common_model import CommonModel
from ...cart.model.cart_item import CartItem
from ...reviews.models.review_model import ReviewsMaster
from flask import request
import jwt
from ....user.service.user_service import get_user_by_username
from ...company.model.company_user import CompanyUser
from ...company.model.company_price import CompanyPrice
from ...service_point.model.service_user import ServiceUser
from ...service_point.model.service_point_price import ServicePointPrice


class ProductMaster(CommonModel, db.Model):
    __tablename__ = "product_master"
    id = db.Column(db.BigInteger(), primary_key=True)
    product_name = db.Column(db.String(), nullable=True)
    price = db.Column(db.Double(), nullable=True)
    offer_price = db.Column(db.Double(), nullable=True)
    category_id = db.Column(
        db.BigInteger, db.ForeignKey("category_master.id"), nullable=True
    )
    sub_category_id = db.Column(
        db.BigInteger, db.ForeignKey("sub_category_master.id"), nullable=True
    )
    gst_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )
    gst = db.relationship(
        "PredefinedMaster", foreign_keys=[gst_id], backref="products_as_gst"
    )

    category = db.relationship(
        "CategoryMaster", foreign_keys=[category_id], backref="products_as_category"
    )
    category = db.relationship(
        "SubCategoryMaster", foreign_keys=[category_id], backref="products_as_category"
    )
    description = db.Column(db.String)
    short_description = db.Column(db.String)
    slug = db.Column(db.String)
    # # Define the relationship with filtering
    product_documents = db.relationship(
        "ProductDocument",
        primaryjoin="and_(ProductMaster.id == ProductDocument.product_id, ProductDocument.is_delete == False)",
        backref="product_document",
    )

    # legacy_hsn_code = db.Column(db.String)
    discounted_price = None
    user_id = None
    reviews_rating = None
    reviews_count = None
    cart_item_id = None

    # @property
    # def product_feature(self):
    #     ProductFeature
    @property
    def reviews_rating(self):
        query = ReviewsMaster.query.filter_by(product_id=self.product_id).filter(
            ReviewsMaster.rating.is_not(None)
        )
        total_rating = query.with_entities(db.func.sum(ReviewsMaster.rating)).scalar()
        if total_rating is not None:
            reviews_rating = total_rating / query.count()
            return reviews_rating

    @property
    def reviews_count(self):
        reviews_count = (
            ReviewsMaster.query.filter_by(product_id=self.product_id)
            .filter(ReviewsMaster.rating.is_not(None))
            .count()
        )
        return reviews_count

    def save(self):
        db.session.add(self)
        db.session.commit()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Set default value for discounted_price in the constructor
        self.discounted_price = kwargs.get("discounted_price", None)

    _is_wishlist = None
    _is_goto = None
    _offer_price = None
    service_point_id = None

    @property
    def offer_price(self):
        # Assuming the JWT token is stored in the request headers
        token = request.headers.get("Authorization")
        if token == "Bearer":
            return self.product_offer_price
        if token:
            try:
                token = token.replace("Bearer ", "")
                # Verify the token
                decoded_token = jwt.decode(
                    token, algorithms=["HS256"], options={"verify_signature": False}
                )

                # Extract user information from the token
                username = decoded_token.get(
                    "sub"
                )  # Assuming 'user_id' is a key in the token payload
                if username is not None:
                    user = get_user_by_username(username=username)
                else:
                    # Token is not present, indicating the user is not logged in
                    return self.offer_price
                if user is not None:
                    price = (
                        CompanyPrice.query.join(
                            CompanyUser,
                            CompanyPrice.company_id == CompanyUser.company_id,
                        )
                        .with_entities(CompanyPrice.price)
                        .filter(
                            CompanyPrice.is_delete == "N",
                            CompanyUser.user_id == user.id,
                            CompanyPrice.product_id == self.product_id,
                        )
                        .first()
                    )
                    if price is not None:
                        if None not in price:
                            # Return the first element of the tuple
                            return price[0]
                    if self.service_point_id is not None:
                        price = (
                            ServicePointPrice.query.join(
                                ServiceUser,
                                ServicePointPrice.service_point_id
                                == ServicePointPrice.service_point_id,
                            )
                            .with_entities(ServicePointPrice.price)
                            .filter(
                                ServicePointPrice.is_delete == "N",
                                ServiceUser.user_id == user.id,
                                ServicePointPrice.service_point_id
                                == self.service_point_id,
                                ServicePointPrice.product_id == self.product_id,
                            )
                            .first()
                        )
                    if price is not None:
                        if None not in price:
                            # Return the first element of the tuple
                            return price[0]

                    return self.product_offer_price
            except jwt.ExpiredSignatureError:
                print("Token has expired.")
            except jwt.InvalidTokenError as e:
                print("Invalid token.")
            except Exception as e:
                print(f"Error decoding token: {e}")
        else:
            # Token is not present, indicating the user is not logged in
            return self.product_offer_price

    @property
    def cart_item_id(self):
        # Assuming the JWT token is stored in the request headers
        token = request.headers.get("Authorization")

        if token:
            try:
                token = token.replace("Bearer ", "")
                # Verify the token
                decoded_token = jwt.decode(
                    token, algorithms=["HS256"], options={"verify_signature": False}
                )

                # Extract user information from the token
                username = decoded_token.get(
                    "sub"
                )  # Assuming 'user_id' is a key in the token payload
                if username is not None:
                    user = get_user_by_username(username=username)
                else:
                    # Token is not present, indicating the user is not logged in
                    return None

                # Proceed with further checks if needed

                # Check if the cache is already populated
                # if cart_item_id is None:
                # Calculate the value of the property

                cart_item_ids = [
                    cart_item.cart_item_id
                    for cart_item in CartItem.query.filter_by(
                        product_id=self.product_id,
                        created_by_id=user.id,
                        is_delete="N",
                        is_wishList=True,
                    ).all()
                ]
                if cart_item_ids is not None:
                    return cart_item_ids[0]
                else:
                    return None
            except jwt.ExpiredSignatureError:
                print("Token has expired.")
            except jwt.InvalidTokenError as e:
                print("Invalid token.")
            except Exception as e:
                print(f"Error decoding token: {e}")
        else:
            # Token is not present, indicating the user is not logged in
            return False

    @property
    def is_wishlist(self):
        # Assuming the JWT token is stored in the request headers
        token = request.headers.get("Authorization")

        if token:
            try:
                token = token.replace("Bearer ", "")
                # Verify the token
                decoded_token = jwt.decode(
                    token, algorithms=["HS256"], options={"verify_signature": False}
                )

                # Extract user information from the token
                username = decoded_token.get(
                    "sub"
                )  # Assuming 'user_id' is a key in the token payload
                if username is not None:
                    user = get_user_by_username(username=username)
                else:
                    # Token is not present, indicating the user is not logged in
                    return False

                # Proceed with further checks if needed

                # Check if the cache is already populated
                if self._is_wishlist is None:
                    # Calculate the value of the property

                    self._is_wishlist = any(
                        cart_item.is_wishList
                        for cart_item in CartItem.query.filter_by(
                            product_id=self.product_id,
                            created_by_id=user.id,
                            is_delete="N",
                        ).all()
                    )

                return self._is_wishlist
            except jwt.ExpiredSignatureError:
                print("Token has expired.")
            except jwt.InvalidTokenError as e:
                print("Invalid token.")
            except Exception as e:
                print(f"Error decoding token: {e}")
        else:
            # Token is not present, indicating the user is not logged in
            return False

    @property
    def is_goto(self):
        # Assuming the JWT token is stored in the request headers
        token = request.headers.get("Authorization")

        if token:
            try:
                token = token.replace("Bearer ", "")
                # Verify the token
                decoded_token = jwt.decode(
                    token, algorithms=["HS256"], options={"verify_signature": False}
                )

                # Extract user information from the token
                username = decoded_token.get(
                    "sub"
                )  # Assuming 'user_id' is a key in the token payload
                if username is not None:
                    user = get_user_by_username(username=username)
                else:
                    # Token is not present, indicating the user is not logged in
                    return False

                # Proceed with further checks if needed

                # Check if the cache is already populated
                if self._is_goto is None:
                    # Calculate the value of the property
                    self._is_goto = any(
                        not cart_item.is_wishList or cart_item.is_wishList is None
                        for cart_item in CartItem.query.filter_by(
                            product_id=self.product_id,
                            created_by_id=user.id,
                            is_delete="N",
                        ).all()
                    )

                return self._is_goto
            except jwt.ExpiredSignatureError:
                print("Token has expired.")
            except jwt.InvalidTokenError as e:
                print("Invalid token.")
            except Exception as e:
                print(f"Error decoding token: {e}")
        else:
            # Token is not present, indicating the user is not logged in
            return False
