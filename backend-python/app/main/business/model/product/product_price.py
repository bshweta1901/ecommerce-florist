from sqlalchemy import BigInteger, Boolean, Column, ForeignKey
from .....extensions import db
from ....utils.model.common_model import CommonModel
from flask_restx import fields
from sqlalchemy.orm import relationship


class ProductPrice(CommonModel, db.Model):
    __tablename__ = "product_document_master"
    id = Column(BigInteger(), primary_key=True)
    weight_id = Column(BigInteger, ForeignKey("predefined_master.id"), nullable=True)
    product_id = Column(BigInteger, ForeignKey("product_master.id"), nullable=True)
    weight = relationship(
        "PredefinedMaster", foreign_keys=[weight_id], backref="product_document"
    )
    product = relationship(
        "ProductMaster", foreign_keys=[product_id], backref="document_as_product"
    )
    is_cake = Column(Boolean, nullable=True, default=False)

    def save(self):
        db.session.add(self)
        db.session.commit()
