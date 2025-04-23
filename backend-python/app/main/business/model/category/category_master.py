from .....extensions import db

from datetime import datetime


class CategoryMaster(CommonModel, db.Model):
    __tablename__ = "category_master"
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    description = db.Column(db.BigInteger)
    code = db.Column(db.String(100))
