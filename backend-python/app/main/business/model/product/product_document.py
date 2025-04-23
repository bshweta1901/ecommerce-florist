from .....extensions import db
from ....utils.model.common_model import CommonModel
from flask_restx import fields


class ProductDocument(CommonModel, db.Model):
    __tablename__ = "product_document_master"
    id = db.Column(db.BigInteger(), primary_key=True)
    document_id = db.Column(
        db.BigInteger, db.ForeignKey("document_master.id"), nullable=True
    )
    product_id = db.Column(
        db.BigInteger, db.ForeignKey("product_master.id"), nullable=True
    )
    document = db.relationship(
        "DocumentMaster", foreign_keys=[document_id], backref="product_document"
    )
    product = db.relationship(
        "ProductMaster", foreign_keys=[product_id], backref="document_as_product"
    )

    def save(self):
        db.session.add(self)
        db.session.commit()
