import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "my_precious_secret_key")
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB


class DatabaseConfig:
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 20,
        "max_overflow": 20,
        "pool_recycle": 3600,
        "pool_timeout": 30,
    }


class FileConfig:
    BASE_PATH = "C:/tempFolder-python/"
    UPLOAD_FOLDER = BASE_PATH
    DOCUMENT_TEMP_UPLOAD = BASE_PATH
    DOCUMENT_TEMP_URL = "http://localhost:5000/uploads/temp/"
    DOCUMENT_UPLOAD = BASE_PATH
    ASSET_BASE_PATH = BASE_PATH
    GENERATE_PDF_BASE_URL = BASE_PATH
    EMAIL_IMAGES = BASE_PATH
    GUEST_TEMP_EXCEL_URL = BASE_PATH
    GENERATE_PDF_ACTUAL_PATH = BASE_PATH


class MailConfig:
    MAIL_PORT = 587
    MAIL_SERVER = "smtp.office365.com"
    MAIL_USERNAME = "no-reply@mechmiles.com"
    MAIL_PASSWORD = "JOTPL@email"
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_DEFAULT_SENDER = "no-reply@mechmiles.com"


class DevelopmentConfig(Config, DatabaseConfig, FileConfig, MailConfig):
    DEBUG = True
    RESTX_MASK_SWAGGER = False
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://saavitek_user:Savi@2025@49.36.98.240/saavitek_ecommerce_florist"
    SQLALCHEMY_ECHO = True
    TYPE = "TEST"

    # JWT Config
    JWT_ACCESS_LIFETIME = timedelta(minutes=1)
    JWT_REFRESH_LIFETIME = timedelta(days=7)


class TestingConfig(Config, DatabaseConfig):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://admin:CricyardDB2024@"
        "cricyarddb.ctck8ggoo0zu.ap-south-1.rds.amazonaws.com/sport_my_soul_2"
    )
    PRESERVE_CONTEXT_ON_EXCEPTION = False

    # File Paths
    BASE_PATH = "/usr/share/nginx/html/"
    UPLOAD_FOLDER = BASE_PATH
    DOCUMENT_TEMP_UPLOAD = BASE_PATH
    DOCUMENT_TEMP_URL = "http://13.203.10.103/"
    DOCUMENT_UPLOAD = BASE_PATH
    ASSET_BASE_PATH = BASE_PATH
    GENERATE_PDF_BASE_URL = BASE_PATH
    EMAIL_IMAGES = BASE_PATH
    GUEST_TEMP_EXCEL_URL = BASE_PATH
    GENERATE_PDF_ACTUAL_PATH = BASE_PATH


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/cricyard"


config_by_name = {
    "dev": DevelopmentConfig,
    "test": TestingConfig,
    "prod": ProductionConfig,
}

key = Config.SECRET_KEY
