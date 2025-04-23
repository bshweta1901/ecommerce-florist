from .....extensions import db
from ....utils.model.common_model import CommonModel


class NotificationConfig(CommonModel, db.Model):
    __tablename__ = "notification_config"
    fcm_notification_config_id = db.Column(
        db.BigInteger, primary_key=True, autoincrement=True
    )
    fcm_server_key = db.Column(db.String(500))
    file_path = db.Column(db.String(500))
    sender_id = db.Column(db.String(500))
    entity_type = db.Column(db.String(500))
