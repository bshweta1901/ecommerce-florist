
from flask import request
from sqlalchemy.orm import joinedload

from ....extensions import db
from ..model.access_control import AccessControl
from ..model.role import user_roles
from ..model.role_module import RoleModule


def get_access_control_list(user):
    page = request.args.get("page_number", type=int)
    per_page = request.args.get("page_size", type=int)
    if user is not None:
        role_ids = [
            role_id
            for (role_id,) in db.session.query(user_roles.c.role_id)
            .filter(user_roles.c.user_id == user.user_id)
            .all()
        ]
        query = (
            AccessControl.query.join(RoleModule, AccessControl.role_module)
            .filter(AccessControl.is_delete == False, RoleModule.role_id.in_(role_ids))
            .filter(RoleModule.is_delete == False)
            .options(joinedload(AccessControl.role_module))
            .distinct(RoleModule.module_id)  # Remove duplicate modules
        )
        if page is not None and per_page is not None:
            query = query.paginate(page=page, per_page=per_page).items
        else:
            query = query.all()
        return query
