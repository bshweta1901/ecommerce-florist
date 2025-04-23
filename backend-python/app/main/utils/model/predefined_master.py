from app.extensions import db
from ...utils.model.common_model import CommonModel

from sqlalchemy import ForeignKey


class PredefinedMaster(CommonModel, db.Model):
    __tablename__ = "predefined_master"
    id = db.Column(
        db.BigInteger, primary_key=True
    )  # Assuming you want a BigInteger for the ID
    name = db.Column(db.String(200))
    code = db.Column(db.String(200))
    entity_type = db.Column(db.String(200))
    sub_entity = db.Column(db.String(200))
    field1 = db.Column(db.String(200))
    field2 = db.Column(db.String(200))
    field3 = db.Column(db.String(200))
    url = db.Column(db.String(500))
    thumbnail = db.Column(db.String(500))
    sequence_order = db.Column(db.Integer())

    # Self-referential relationship
    parent_id = db.Column(db.BigInteger, ForeignKey("predefined_master.id"))
    parent = db.relationship(
        "PredefinedMaster", remote_side=[id], backref="parent_children", lazy="joined"
    )
