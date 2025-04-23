from .....extensions import db
from ....utils.model.common_model import CommonModel


class ReviewsMaster(CommonModel, db.Model):
    __tablename__ = "reviews_master"
    review_id = db.Column(db.BigInteger(), primary_key=True, autoincrement=True)
    rating = db.Column(db.Float(), nullable=True)

    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=True)
    product_id = db.Column(
        db.BigInteger, db.ForeignKey("product_master.product_id"), nullable=True
    )

    user = db.relationship("User", foreign_keys=[user_id], backref="user_as_reviews")
    product = db.relationship(
        "ProductMaster", foreign_keys=[product_id], backref="products_as_reviews"
    )
    comments = db.Column(db.String)  # Add the new column for product image

    def save(self):
        db.session.add(self)
        db.session.commit()
