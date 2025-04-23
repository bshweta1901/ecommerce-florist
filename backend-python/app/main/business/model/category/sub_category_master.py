class SubCategoryMaster(CommonModel, db.Model):
    __tablename__ = "sub_category_master"
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    description = db.Column(db.BigInteger)
    code = db.Column(db.String(100))
