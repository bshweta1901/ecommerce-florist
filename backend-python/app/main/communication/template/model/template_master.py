from .....extensions import db
from ....utils.model.common_model import CommonModel


class TemplateMaster(CommonModel, db.Model):
    __tablename__ = "template_master"
    template_master_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    template_code = db.Column(db.String(500))
    template_name = db.Column(db.String(500))
    fcm_image_url = db.Column(db.String(500))
    template_title = db.Column(db.String(500))
    template_type = db.Column(db.String(500))
    entity_type = db.Column(db.String(500))
    entity_sub_type = db.Column(db.String(500))
    template_data = db.Column(db.String(500))
    template_resource_name = db.Column(db.String(500))
    sms_dlt_template_id = db.Column(db.String(500))
    whatsapp_wait_template_code = db.Column(db.String(500))
