from cryptography.fernet import Fernet
import base64

from flask import current_app


class EncryptionHelper:
    @staticmethod
    def get_fernet():
        secret_key = current_app.config['SECRET_KEY'].encode()
        fernet = Fernet(base64.urlsafe_b64encode(secret_key.ljust(32)[:32]))
        return fernet

    @staticmethod
    def encrypt(text):
        fernet = EncryptionHelper.get_fernet()
        return fernet.encrypt(text.encode()).decode()

    @staticmethod
    def decrypt(token):
        fernet = EncryptionHelper.get_fernet()
        return fernet.decrypt(token.encode()).decode()
