from app.extensions import db
from ...utils.model.common_model import CommonModel


class DocumentMaster(CommonModel, db.Model):

    __tablename__ = "document_master"

    id = db.Column(db.BigInteger, primary_key=True)
    document_name = db.Column(db.String(255))
    file_path = db.Column(db.String(255))
    file_type = db.Column(db.String(255))
    entity_name = db.Column(db.String(255))
    s3_key_thumbnail = db.Column(db.String(255))
    title = db.Column(db.String(255))
    duration = db.Column(db.String(255))
    description = db.Column(db.String(255))
    document_selected_path = db.Column(db.String(255))
    folder_name = db.Column(db.String(255))
    actual_path = db.Column(db.String(255))

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self  # Return the saved document object
        except Exception as e:
            db.session.rollback()
            print(f"Error saving document: {e}")
            return None  # Return None or handle the error accordingly
