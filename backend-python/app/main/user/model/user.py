from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Column,
    Date,
    ForeignKey,
    String,
    Float,
    Text,
    or_,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from app.extensions import Base, db, flask_bcrypt

from ...auth.model.auth_config import AuthConfig
from ...utils.model.common_model import CommonModel
from .role import Role, user_roles

# from ...utils.service.generate_uuid import generate_uuid


class User(CommonModel, Base):
    """User Model for storing user-related details"""

    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(200), nullable=True)
    email = Column(String(500), nullable=True, unique=True)
    phone = Column(String(500), nullable=True)
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    full_name = Column(String(200), nullable=True)
    description = Column(String(500), nullable=True)
    password_hash = Column(String(100), nullable=True)
    dob = Column(Date, nullable=True)
    gender_id = Column(BigInteger(), ForeignKey("predefined_master.id"))
    gender = relationship(
        "PredefinedMaster", foreign_keys=[gender_id], backref="user_gender"
    )
    addresses = db.relationship(
        "UserAddress",
        backref="user_ref",
        lazy="dynamic",
        foreign_keys="[UserAddress.user_id]",
    )

    # One-to-One relationship with DocumentMaster for profile image
    profile_img_id = Column(BigInteger(), ForeignKey("document_master.id"))
    profile_img = relationship(
        "DocumentMaster", foreign_keys=[profile_img_id], backref="user_profile_image"
    )

    facebook_auth_token = Column(String(500), nullable=True)
    google_auth_token = Column(String(500), nullable=True)
    apple_auth_token = Column(String(500), nullable=True)

    @property
    def roles_name(self):
        role_codes = [role.code for role in self.roles] if self.roles else []
        return ", ".join(role_codes)

    @property
    def roles_ids(self):
        role_id = [role.id for role in self.roles] if self.roles else []
        return role_id

    @hybrid_property
    def password(self):
        """Raise an error for password access (write-only)"""
        raise AttributeError("password: write-only field")

    @password.setter
    def password(self, password):
        """Hash and set the user's password"""
        if password:
            self.password_hash = flask_bcrypt.generate_password_hash(password).decode(
                "utf-8"
            )
        else:
            self.password_hash = None

    def check_password(self, password):
        """Verify the user's password"""
        return flask_bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User '{self.id}'>"

    def get_auth_config(self, session):
        """
        Fetch AuthConfig based on the user's roles.
        :param session: SQLAlchemy session for querying the database.
        """
        # Extract role codes for the user
        role_codes = [role.code for role in self.roles]
        # Query AuthConfig matching any of the user's roles
        auth_config = (
            session.query(AuthConfig)
            .filter(or_(*(AuthConfig.roles.ilike(f"%{role}%") for role in role_codes)))
            .first()
        )
        return auth_config
