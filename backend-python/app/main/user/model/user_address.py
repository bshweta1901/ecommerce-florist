from datetime import datetime
from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    Date,
    ForeignKey,
    String,
    Float,
    Text,
    or_,
)
from sqlalchemy.orm import relationship
from ...utils.model.common_model import CommonModel


class UserAddress(CommonModel):
    __tablename__ = "user_address"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    detail_address = Column(String(255), nullable=True)
    street_address = Column(String(255), nullable=True)
    landmark = Column(String(255), nullable=True)
    pincode = Column(String(20), nullable=True)
    entity_type = Column(String(100), nullable=True)
    is_default = Column(Boolean, default=True)

    city_id = Column(BigInteger, ForeignKey("predefined_master.id"), nullable=True)
    city = relationship(
        "PredefinedMaster", foreign_keys=[city_id], backref="address_city"
    )

    state_id = Column(BigInteger, ForeignKey("predefined_master.id"), nullable=True)
    state = relationship("PredefinedMaster", foreign_keys=[state_id], backref="state")

    country_id = Column(BigInteger, ForeignKey("predefined_master.id"), nullable=True)
    country = relationship(
        "PredefinedMaster", foreign_keys=[country_id], backref="country"
    )

    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True, default=1)
    user = relationship("User", back_populates="addresses", foreign_keys=[user_id])
