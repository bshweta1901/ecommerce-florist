from datetime import datetime
from uuid import uuid4
import pytz
from app.extensions import db
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.event import listens_for
from flask import g


def indian_time_now():
    tz = pytz.timezone("Asia/Kolkata")  # Indian timezone
    return datetime.now(tz)


def get_current_user_id():
    # Assuming user ID is stored in Flask's global `g` object after token validation
    return getattr(g, "user_id", None)


class CommonModel(db.Model):
    __abstract__ = True
    __table_args__ = {"extend_existing": True}

    uuid = db.Column(db.String(50), unique=True, default=lambda: str(uuid4()))
    is_active = db.Column(db.Boolean(), default=True)
    is_delete = db.Column(db.Boolean(), default=False)
    created_at = db.Column(db.DateTime(), default=indian_time_now)
    modified_at = db.Column(
        db.DateTime(), default=indian_time_now, onupdate=indian_time_now
    )

    @declared_attr
    def created_by(cls):
        return db.Column(db.BigInteger(), db.ForeignKey("users.id"))

    @declared_attr
    def modified_by(cls):
        return db.Column(db.BigInteger(), db.ForeignKey("users.id"))


# Automatically set created_by and modified_by
@listens_for(CommonModel, "before_insert", propagate=True)
def set_created_by(mapper, connect, target):
    user_id = getattr(g, "user_id", None)  # Get user_id from g
    if user_id is not None:
        target.created_by = user_id
        target.modified_by = user_id


@listens_for(CommonModel, "before_update", propagate=True)
def set_modified_by(mapper, connect, target):
    try:
        user_id = getattr(g, "user_id", None)  # Get user_id from g
        # Ensure user_id is valid (not a dictionary)
        if isinstance(user_id, tuple):
            print(f"Invalid user_id in set_modified_by: {user_id}")
            return  # Skip updating modified_by if user_id is invalid

        if user_id is not None:
            target.modified_by = user_id
    except Exception as e:
        print(f"Error in set_modified_by: {e}")  # Log the exception
