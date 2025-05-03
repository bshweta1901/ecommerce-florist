from app.main.utils.model.common_model import CommonModel
from sqlalchemy import BigInteger, Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.extensions import Base


class Category(CommonModel, Base):
    """Category Model for storing product categories"""

    __tablename__ = "category"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, unique=True)
    description = Column(String(500), nullable=True)
    category_img_id = Column(
        BigInteger, ForeignKey("document_master.id"), nullable=True
    )
    category_img = relationship(
        "DocumentMaster", foreign_keys=[category_img_id], backref="category_document"
    )

    @property
    def category_img_path(self):
        if self.category_img is not None:
            return self.category_img.file_path

    def __repr__(self):
        return f"<Category '{self.id}'>"
