from random import randint

from flask import current_app
from sqlalchemy import BigInteger, Column, DateTime, Integer, String

from app.extensions import Base
from app.main.exceptation.custom_exception import CustomException

from ....extensions import db, session_scope
from ...utils.model.common_model import CommonModel, indian_time_now


class UserOtp(CommonModel, Base):
    __tablename__ = "user_otp"

    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    otp = Column(String(50), nullable=False)
    username = Column(String(200), nullable=False)
    expiry_date_time = Column(DateTime())

    @classmethod
    def get_otp_by_email(cls, session, email):
        """Fetch OTP by email using a session."""
        return session.query(cls).filter_by(email=email).first()

    @classmethod
    def get_otp_by_phone(cls, session, phone):
        """Fetch OTP by phone using a session."""
        return session.query(cls).filter_by(phone=phone).first()

    @classmethod
    def verify_otp(self, session, username, otp):
        """Verify if OTP matches the given email using a session."""
        current_date_time = indian_time_now()
        return session.query(UserOtp).filter(UserOtp.username == username, UserOtp.otp == otp, UserOtp.expiry_date_time >= current_date_time).first() is not None

    @staticmethod
    def random_with_N_digits(n):
        """Generate a random OTP of N digits."""
        range_start = 10**(n-1)
        range_end = (10**n)-1
        return str(randint(range_start, range_end))

    def save(self, session):
        """Save the OTP object to the database using the provided session."""
        try:
            session.add(self)
            session.commit()
        except Exception as e:
            session.rollback()  # Rollback in case of an error
            current_app.logger.error(f"Error saving OTP: {e}")
            raise CustomException(str(e), 500)
