from ..model.role import Role
from ....extensions import db


def get_role_by_code(code):
    return db.session.query(Role).filter_by(code=code).first()
