from .....extensions import db
from ....utils.model.common_model import CommonModel


class CommunicationLogs(CommonModel, db.Model):
    __tablename__ = "communication_logs"
    log_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(500))
    message = db.Column(db.String(500))
    entity_type = db.Column(db.String(500))
    entity_id = db.Column(db.BigInteger())
    type = db.Column(db.String(500))
    from_user_id = db.Column(db.String(500))
    to_user_id = db.Column(db.String(500))
    service_point_id = db.Column(db.Integer())
    error_message = db.Column(db.String(500))
    status = db.Column(db.String(500))
    notification_read = db.Column(db.Boolean())
    icon_path = db.Column(db.String(500))
    parent_user_id = db.Column(db.String(500))
