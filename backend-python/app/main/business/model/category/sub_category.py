from app.main.utils.model.common_model import CommonModel
from sqlalchemy import BigInteger, Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.extensions import Base


class SubCategory(CommonModel, Base):
    """SubCategory Model for storing subcategories under categories"""

    __tablename__ = "sub_category"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    description = Column(String(500), nullable=True)

    # Foreign key linking to Category
    category_id = Column(BigInteger, ForeignKey("category.id"), nullable=False)

    # Relationship with Category
    category = relationship(
        "Category", foreign_keys=[category_id], backref="subcategories"
    )
    sub_category_img_id = Column(
        BigInteger, ForeignKey("document_master.id"), nullable=True
    )
    sub_category_img = relationship(
        "DocumentMaster",
        foreign_keys=[sub_category_img_id],
        backref="sub_category_document",
    )
