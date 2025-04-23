from .....extensions import db
from datetime import datetime


class CartItem(db.Model):
    __tablename__ = "cart_item"
    cart_item_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    product_id = db.Column(db.BigInteger, db.ForeignKey("product_master.product_id"))
    service_id = db.Column(db.BigInteger, db.ForeignKey("service_master.service_id"))
    item_quantity = db.Column(db.BigInteger)
    total_amount = db.Column(db.Float)
    total_amount_with_qty = db.Column(db.Float)
    product_price = db.Column(db.Float)
    discount = db.Column(db.Float)
    product = db.relationship(
        "ProductMaster", foreign_keys=[product_id], backref="cart_items_product"
    )
    service = db.relationship(
        "ServiceMaster", foreign_keys=[service_id], backref="cart_items_service"
    )
    is_wishList = db.Column(db.Boolean, default=False)
    created_by_id = db.Column(
        db.BigInteger, db.ForeignKey("users.id"), nullable=True, default=1
    )
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    created_by = db.relationship(
        "User", foreign_keys=[created_by_id], backref="cart_items"
    )
    is_delete = db.Column(db.String(10), default="N")
    is_deactivate = db.Column(db.String(10), default="N")
    vehicle_id = db.Column(db.BigInteger, db.ForeignKey("vehicle.id"), nullable=False)
    service_point_id = db.Column(
        db.BigInteger, db.ForeignKey("service_point.service_point_id"), nullable=True
    )
    service_point = db.relationship(
        "ServicePoint",
        foreign_keys=[service_point_id],
        backref="cart_as_service_point_from_service_point_cart",
    )
    vehicle = db.relationship(
        "Vehicle", foreign_keys=[vehicle_id], backref="Vehicle_for_cart_item"
    )

    @classmethod
    def get_cart_item(cls):
        return cls.get_cart_item()
