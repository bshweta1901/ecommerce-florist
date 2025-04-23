from contextlib import contextmanager
import os
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask import Blueprint, current_app
from flask_restx import Api
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_caching import Cache
from .config import config_by_name

os.environ["BOILERPLATE_ENV"] = "dev"
config_name = os.getenv("BOILERPLATE_ENV")
config = config_by_name[config_name]

# Initialize SQLAlchemy engine and session factory with connection pooling
engine = create_engine(
    config.SQLALCHEMY_DATABASE_URI, **config.SQLALCHEMY_ENGINE_OPTIONS
)
SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)


@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    session = SessionLocal()
    try:
        yield session
        session.commit()  # Ensure commit happens
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
flask_bcrypt = Bcrypt()
cache = Cache()

# Create a blueprint for the API
blueprint = Blueprint("api", __name__)
authorizations = {
    "apikey": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-KEY",
        "description": "API key needed to access the API",
    },
    "jwt": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "description": 'JWT token needed to access the API.  Prefix with "Bearer "',
    },
}
# Initialize a single instance of the Api
api = Api(
    blueprint,
    title="Flask Backend API",
    version="1.0",
    description="Assubo API's Documentation",
    authorizations=authorizations,
    security="jwt",  # Use the security scheme defined above
)
Base = db.Model

# Ensure to register this blueprint in your create_app function
