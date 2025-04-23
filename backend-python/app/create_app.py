from app.main.utils.service.utility import get_id_by_uuid
from flask import Flask, jsonify, g, request
from flask_cors import CORS
from flask_jwt_extended import decode_token
from flask_migrate import Migrate
from flask_mail import Mail
import werkzeug
import os

from app.api import register_namespaces
from app.main.exceptation.custom_exception import CustomException
from app.main.user.model.user import User


from .config import config_by_name
from .extensions import db, jwt, flask_bcrypt, blueprint
from .extensions import api as api_data
from .logger_config import set_logger_config
from app.main.exceptation.exception_handler import expired_token_callback


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(
        config_by_name[os.getenv("BOILERPLATE_ENV") or "dev"])
    app.config["CORS_HEADERS"] = "Content-Type"
    app.config["ERROR_404_HELP"] = False

    # Setup logging
    set_logger_config()

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    flask_bcrypt.init_app(app)

    # Initialize Flask-Mail
    mail = Mail(app)

    # Handle exceptions globally

    @app.before_request
    def before_request():
        g.db_session = db.session
        token = request.headers.get("Authorization")
        if token:
            try:
                # Ensure correct format by removing "Bearer" prefix if present
                token = token.replace("Bearer ", "").strip()
                decoded_token = decode_token(token)
                # Assuming 'sub' holds the user ID
                uuid = decoded_token.get("uuid")
                g.user_id = get_id_by_uuid(uuid, User)
            except Exception as e:

                g.user_id = None
        else:
            g.user_id = None

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session = g.pop("db_session", None)
        if db_session is not None:
            db_session.remove()

    Migrate(app, db)

    # Register all namespaces
    register_namespaces(api_data)
    app.register_blueprint(blueprint, url_prefix="/api")

    @app.errorhandler(CustomException)
    def handle_custom_exception(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    # Handle expired tokens
    jwt.expired_token_loader(expired_token_callback)

    # Create all database tables
    with app.app_context():
        db.create_all()

    return app
