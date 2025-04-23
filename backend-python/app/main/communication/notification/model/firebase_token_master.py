from .....extensions import db
from ....utils.model.common_model import CommonModel


class FirebaseTokenMaster(CommonModel, db.Model):
    __tablename__ = "firebase_token_master"
    token_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger)
    device_type = db.Column(db.String(500))
    firebase_token = db.Column(db.String(500))
    device_id = db.Column(db.String(500))
