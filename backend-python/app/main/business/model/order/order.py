from sqlalchemy import BigInteger, Column, ForeignKey, String, Double
from sqlalchemy.orm import relationship

from app.extensions import Base
from app.main.utils.model.common_model import CommonModel

from sqlalchemy.orm import relationship


class OrderMaster(CommonModel, Base):
    __tablename__ = "order_master"
    id = Column(
        BigInteger, primary_key=True
    )  # Assuming you want a BigInteger for the ID
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    user = relationship(
        "User",
        foreign_keys=[user_id],
        backref="order_users",
    )
    status_id = Column(BigInteger, ForeignKey("predefined_master.id"), nullable=True)
    status = relationship(
        "PredefinedMaster", foreign_keys=[status_id], backref="order_status"
    )

    address_id = Column(BigInteger, ForeignKey("user_address.id"), nullable=True)
    address = relationship(
        "UserAddress",
        foreign_keys=[address_id],
        backref="order_shipping_address",
    )

    amount = Column(Double)
    tax = Column(Double)
    coupon_discount = Column(Double)
    coupon_code = Column(String(200))
    payable_amount = Column(Double)
    total_amount = Column(Double)
    order_items = relationship(
        "OrderItem",
        backref="order_item_ref",
        lazy="dynamic",
        primaryjoin="OrderMaster.id == OrderItem.order_id",  # Specify the join condition
    )
    coupon_id = Column(BigInteger, ForeignKey("coupon_master.coupon_id"), nullable=True)
    coupon = relationship(
        "CouponMaster", foreign_keys=[coupon_id], backref="order_coupon"
    )

    payment_status_id = Column(
        BigInteger, ForeignKey("predefined_master.id"), nullable=True
    )
    payment_status = relationship(
        "PredefinedMaster",
        foreign_keys=[payment_status_id],
        backref="order_payment",
    )
    invoice_id = Column(BigInteger, ForeignKey("document_master.id"), nullable=True)
    invoice = relationship(
        "DocumentMaster",
        foreign_keys=[invoice_id],
        backref="order_invoices",
    )

    total_quantity = None
    admin_user = None
    admin_user_dept = None
    service_point_user = None
    appointment_date = None

    @property
    def total_quantity(self):
        # Use a default value of 0 if sp_quantity is None
        return sum(
            item.item_quantity if item.item_quantity is not None else 0
            for item in self.order_items
        )

    @classmethod
    def get_order_master(cls):
        return cls.get_order_master()
