from .....extensions import db
from ....utils.model.common_model import CommonModel


class NotificationMaster(CommonModel, db.Model):
    __tablename__ = "notification_master"
    notification_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200))
    message = db.Column(db.String(1500))
    image_url = db.Column(db.String(1500))
    topic = db.Column(db.String(50))
    entity_type = db.Column(db.String(50))
    entity_sub_type = db.Column(db.String(50))
    role_name = db.Column(db.String(50))
    entity_id = db.Column(db.BigInteger)
    entity_user_id = db.Column(db.BigInteger)
    mark_as_read = db.Column(db.String(10), default="N")
    json_data = db.Column(db.String(500000))
