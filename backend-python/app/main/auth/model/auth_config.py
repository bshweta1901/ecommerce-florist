from sqlalchemy import BigInteger, Column, String, Boolean, or_

from app.extensions import Base

from ....extensions import db

# from ...utils.service.generate_uuid import generate_uuid


class AuthConfig(Base):
    __tablename__ = "auth_config"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    auth_type = Column(String(100))  # OTP or PASSWORD
    username_field = Column(String(100))  # phone, email or username
    otp_verification_on = Column(
        String(100)
    )  # email, phone or both (If auth type is OTP)
    roles = Column(String(300))  # comma seperated roles
    is_admin = Column(Boolean())  # WEB,ADMIN,APP,POSAPP,etc

    def __repr__(self):
        return f"<Auth Config {self.auth_config_id}>"

    def get_auth_config_by_roles(roles, session):

        # Query the database to fetch AuthConfig records with roles matching the provided roles
        auth_configs = (
            session.query(AuthConfig).filter(AuthConfig.roles.in_(roles)).first()
        )
        return auth_configs
