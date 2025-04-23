
from sqlalchemy import BigInteger, Column, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from app.extensions import Base
from app.main.utils.model.common_model import CommonModel

from ....extensions import db

# from ...utils.service.generate_uuid import generate_uuid


user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', BigInteger, ForeignKey(
        'users.id'), primary_key=True),
    Column('role_id', BigInteger, ForeignKey('role.id'), primary_key=True)
)


class Role(CommonModel, Base):

    __tablename__ = 'role'

    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    code = Column(String(50), nullable=False)
    description = Column(String(500), nullable=True)

    users = relationship('User', secondary=user_roles, back_populates='roles')

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def get_role_by_code(cls, code):
        return cls.query.filter_by(code=code).first()
