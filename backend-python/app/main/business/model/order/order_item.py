from app.extensions import Base
from app.main.business.model.product.product_master import ProductMaster
from app.main.utils.model.common_model import CommonModel
from sqlalchemy import BigInteger, Column, ForeignKey, String, Double

from sqlalchemy.orm import relationship


class OrderItem(CommonModel, Base):
    __tablename__ = "order_item"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(
        BigInteger,
        ForeignKey("product_master.id"),
    )
    product = relationship(
        "ProductMaster", lazy="joined", backref="product_from_order_item"
    )
    order_id = Column(
        BigInteger,
        ForeignKey("order_master.id"),
    )
    order = relationship("OrderMaster", lazy="joined", backref="order_from_order_item")
    item_quantity = Column(BigInteger)
    amount = Column(Double)
    tax = Column(Double)
    total_base_amount = Column(Double)
    total_purchase_amount = Column(Double)
    total_amount = Column(Double)
    discount = Column(Double)
    qty_balance = Column(BigInteger)

    def conver_cart_item_to_order_item(self, cart_item):
        self.product_purchase_price = 0
        self.base_price = 0
        if cart_item.product_id is not None:
            product = ProductMaster.query.filter(
                ProductMaster.product_id == cart_item.product_id
            ).first()
            amount = (
                product.product_offer_price
                if (
                    product.product_offer_price != None
                    or product.product_offer_price != 0
                )
                else product.product_price
            )
            self.product_purchase_price = (
                product.purchase_price if product.purchase_price is not None else 0
            )
            if amount is not None:
                self.base_price = amount
                self.total_base_amount = amount * cart_item.item_quantity
                self.total_purchase_amount = (
                    self.product_purchase_price * cart_item.item_quantity
                )
        self.product_id = cart_item.product_id
        self.service_id = cart_item.service_id
        self.item_quantity = cart_item.item_quantity
        self.qty_balance = cart_item.item_quantity
        self.vehicle_id = cart_item.vehicle_id
        self.amount = cart_item.total_amount
        self.total_amount = cart_item.total_amount * self.item_quantity
        self.discount = cart_item.discount
        self.is_deactivate = "N"
        self.is_delete = "N"
        # self.base_price = cart_item.product_price
