from .....extensions import db
from ....utils.model.common_model import CommonModel


class CouponMaster(CommonModel, db.Model):
    __tablename__ = "coupon_master"

    coupon_id = db.Column(db.BigInteger(), primary_key=True, autoincrement=True)
    name = db.Column(db.String())
    code = db.Column(db.String(), unique=True)
    discount = db.Column(db.Float())
    start_date = db.Column(db.Date())
    expiry_date = db.Column(db.Date())
    min_slab = db.Column(db.Float())
    max_amount = db.Column(db.Float())
    is_percent = db.Column(db.Boolean())
    is_unique = db.Column(db.Boolean())
    description = db.Column(db.String())
    sub_title = db.Column(db.String())

    @classmethod
    def get_coupon_master(cls):
        return cls.get_coupon_master()
