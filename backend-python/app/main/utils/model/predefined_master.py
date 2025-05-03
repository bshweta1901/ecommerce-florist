from app.extensions import db
from ...utils.model.common_model import CommonModel
from sqlalchemy import BigInteger, Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.extensions import Base


class PredefinedMaster(CommonModel, db.Model):

    __tablename__ = "predefined_master"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    code = Column(String(500), nullable=True)
    entity_type = Column(String(500), nullable=True)
    field1 = Column(String(200))
    field2 = Column(String(200))
    field3 = Column(String(200))
    url = Column(String(500))
    thumbnail = Column(String(500))
    sequence_order = Column(Integer())

    # Self-referential relationship
    parent_id = Column(BigInteger, ForeignKey("predefined_master.id"))
    parent = relationship(
        "PredefinedMaster", remote_side=[id], backref="parent_children", lazy="joined"
    )
