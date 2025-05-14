import datetime
from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, String, Double
from sqlalchemy.orm import relationship
from app.extensions import Base
from app.main.utils.model.common_model import CommonModel


class CartItem(CommonModel, Base):
    __tablename__ = "cart_item"
    cart_item_id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("product_master.id"))
    customer_id = Column(BigInteger)
    item_quantity = Column(BigInteger)
    total_amount = Column(Double)
    total_amount_with_qty = Column(Double)
    product_price = Column(Double)
    discount = Column(Double)
    product = relationship(
        "ProductMaster", foreign_keys=[product_id], backref="cart_items_product"
    )
    is_wishList = Column(Boolean, default=False)

    @classmethod
    def get_cart_item(cls):
        return cls.get_cart_item()
