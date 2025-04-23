from .....extensions import db
from ....utils.model.common_model import CommonModel
from ...product.model.product_master import ProductMaster


class OrderItem(CommonModel, db.Model):
    __tablename__ = "order_item"
    order_item_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    product_id = db.Column(
        db.BigInteger,
        db.ForeignKey("product_master.product_id"),
    )
    service_id = db.Column(
        db.BigInteger,
        db.ForeignKey("service_master.service_id"),
    )
    order_id = db.Column(
        db.BigInteger,
        db.ForeignKey("order_master.order_id"),
    )
    item_quantity = db.Column(db.BigInteger)
    amount = db.Column(db.Float)
    product_purchase_price = db.Column(db.Float)
    base_price = db.Column(db.Float)
    tax = db.Column(db.Float)
    total_base_amount = db.Column(db.Float)
    total_purchase_amount = db.Column(db.Float)
    total_amount = db.Column(db.Float)
    discount = db.Column(db.Float)
    qty_balance = db.Column(db.BigInteger)
    product = db.relationship(
        "ProductMaster", lazy="joined", backref="product_from_order_item"
    )
    service = db.relationship(
        "ServiceMaster", lazy="joined", backref="service_from_order_item"
    )
    order = db.relationship(
        "OrderMaster", lazy="joined", backref="order_from_order_item"
    )

    vehicle_id = db.Column(db.BigInteger, db.ForeignKey("vehicle.id"), nullable=False)
    vehicle = db.relationship(
        "Vehicle", foreign_keys=[vehicle_id], backref="Vehicle_for_order_item"
    )
    # department_id = db.Column(
    #     db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    # )
    # department = db.relationship(
    #     "PredefinedMaster",
    #     foreign_keys=[department_id],
    #     backref="department_from_order_item",
    # )
    # qty_unassigned = db.Column(db.BigInteger())

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
