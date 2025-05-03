from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.extensions import Base
from app.main.business.model.category.category_master import Category
from app.main.business.model.category.sub_category import SubCategory
from app.main.utils.model.common_model import CommonModel


# from ...utils.service.generate_uuid import generate_uuid


class ProductMaster(CommonModel, Base):
    """Product Model for storing product-related details"""

    __tablename__ = "product_master"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    is_add_on = Column(Boolean())
    description = Column(String(500), nullable=True)
    short_description = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    offer_price = Column(Float, nullable=False)
    sku = Column(String(100), nullable=False)
    product_status_id = Column(
        BigInteger, ForeignKey("predefined_master.id"), nullable=True
    )
    product_status = relationship(
        "PredefinedMaster", foreign_keys=[product_status_id], backref="products_status"
    )
    category_id = Column(BigInteger, ForeignKey("category.id"), nullable=True)
    category = relationship(
        "Category", foreign_keys=[category_id], backref="products_category"
    )
    sub_category_id = Column(BigInteger, ForeignKey("sub_category.id"), nullable=True)
    sub_category = relationship(
        "SubCategory", foreign_keys=[sub_category_id], backref="products_sub_category"
    )
    product_images = relationship(
        "ProductDocument",
        backref="product_doc",
        primaryjoin="and_(ProductMaster.id == ProductDocument.product_id, ProductDocument.is_delete == 'N')",
    )

    @property
    def product_status_name(self):
        return self.product_status.name if self.product_status is not None else None

    # @property
    # def reviews_rating(self):
    #     query = ReviewsMaster.query.filter_by(product_id=self.product_id).filter(
    #         ReviewsMaster.rating.is_not(None)
    #     )
    #     total_rating = query.with_entities(db.func.sum(ReviewsMaster.rating)).scalar()
    #     if total_rating is not None:
    #         reviews_rating = total_rating / query.count()
    #         return reviews_rating

    # @property
    # def reviews_count(self):
    #     reviews_count = (
    #         ReviewsMaster.query.filter_by(product_id=self.product_id)
    #         .filter(ReviewsMaster.rating.is_not(None))
    #         .count()
    #     )
    #     return reviews_count

    # def save(self):
    #     db.session.add(self)
    #     db.session.commit()

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)

    #     # Set default value for discounted_price in the constructor
    #     self.discounted_price = kwargs.get("discounted_price", None)

    # _is_wishlist = None
    # _is_goto = None
    # _offer_price = None
    # service_point_id = None

    # @property
    # def cart_item_id(self):
    #     # Assuming the JWT token is stored in the request headers
    #     token = request.headers.get("Authorization")

    #     if token:
    #         try:
    #             token = token.replace("Bearer ", "")
    #             # Verify the token
    #             decoded_token = jwt.decode(
    #                 token, algorithms=["HS256"], options={"verify_signature": False}
    #             )

    #             # Extract user information from the token
    #             username = decoded_token.get(
    #                 "sub"
    #             )  # Assuming 'user_id' is a key in the token payload
    #             if username is not None:
    #                 user = get_user_by_username(username=username)
    #             else:
    #                 # Token is not present, indicating the user is not logged in
    #                 return None

    #             # Proceed with further checks if needed

    #             # Check if the cache is already populated
    #             # if cart_item_id is None:
    #             # Calculate the value of the property

    #             cart_item_ids = [
    #                 cart_item.cart_item_id
    #                 for cart_item in CartItem.query.filter_by(
    #                     product_id=self.product_id,
    #                     created_by_id=user.id,
    #                     is_delete="N",
    #                     is_wishList=True,
    #                 ).all()
    #             ]
    #             if cart_item_ids is not None:
    #                 return cart_item_ids[0]
    #             else:
    #                 return None
    #         except jwt.ExpiredSignatureError:
    #             print("Token has expired.")
    #         except jwt.InvalidTokenError as e:
    #             print("Invalid token.")
    #         except Exception as e:
    #             print(f"Error decoding token: {e}")
    #     else:
    #         # Token is not present, indicating the user is not logged in
    #         return False

    # @property
    # def is_wishlist(self):
    #     # Assuming the JWT token is stored in the request headers
    #     token = request.headers.get("Authorization")

    #     if token:
    #         try:
    #             token = token.replace("Bearer ", "")
    #             # Verify the token
    #             decoded_token = jwt.decode(
    #                 token, algorithms=["HS256"], options={"verify_signature": False}
    #             )

    #             # Extract user information from the token
    #             username = decoded_token.get(
    #                 "sub"
    #             )  # Assuming 'user_id' is a key in the token payload
    #             if username is not None:
    #                 user = get_user_by_username(username=username)
    #             else:
    #                 # Token is not present, indicating the user is not logged in
    #                 return False

    #             # Proceed with further checks if needed

    #             # Check if the cache is already populated
    #             if self._is_wishlist is None:
    #                 # Calculate the value of the property

    #                 self._is_wishlist = any(
    #                     cart_item.is_wishList
    #                     for cart_item in CartItem.query.filter_by(
    #                         product_id=self.product_id,
    #                         created_by_id=user.id,
    #                         is_delete="N",
    #                     ).all()
    #                 )

    #             return self._is_wishlist
    #         except jwt.ExpiredSignatureError:
    #             print("Token has expired.")
    #         except jwt.InvalidTokenError as e:
    #             print("Invalid token.")
    #         except Exception as e:
    #             print(f"Error decoding token: {e}")
    #     else:
    #         # Token is not present, indicating the user is not logged in
    #         return False

    # @property
    # def is_goto(self):
    #     # Assuming the JWT token is stored in the request headers
    #     token = request.headers.get("Authorization")

    #     if token:
    #         try:
    #             token = token.replace("Bearer ", "")
    #             # Verify the token
    #             decoded_token = jwt.decode(
    #                 token, algorithms=["HS256"], options={"verify_signature": False}
    #             )

    #             # Extract user information from the token
    #             username = decoded_token.get(
    #                 "sub"
    #             )  # Assuming 'user_id' is a key in the token payload
    #             if username is not None:
    #                 user = get_user_by_username(username=username)
    #             else:
    #                 # Token is not present, indicating the user is not logged in
    #                 return False

    #             # Proceed with further checks if needed

    #             # Check if the cache is already populated
    #             if self._is_goto is None:
    #                 # Calculate the value of the property
    #                 self._is_goto = any(
    #                     not cart_item.is_wishList or cart_item.is_wishList is None
    #                     for cart_item in CartItem.query.filter_by(
    #                         product_id=self.product_id,
    #                         created_by_id=user.id,
    #                         is_delete="N",
    #                     ).all()
    #                 )

    #             return self._is_goto
    #         except jwt.ExpiredSignatureError:
    #             print("Token has expired.")
    #         except jwt.InvalidTokenError as e:
    #             print("Invalid token.")
    #         except Exception as e:
    #             print(f"Error decoding token: {e}")
    #     else:
    #         # Token is not present, indicating the user is not logged in
    #         return False
