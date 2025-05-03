import uuid
from app.main.exceptation.custom_exception import CustomException
from app.main.utils.model.predefined_master import PredefinedMaster
from sqlalchemy import Double, Integer, asc, case, cast, distinct, func
from flask import current_app
from ...utils.service.document_service import upload_document
import os
from app.extensions import db
from app.extensions import session_scope
from ...utils.service.utility import (
    set_object_id_exists,
    get_object_by_uuid,
    transform_data,
)
from sqlalchemy.orm import joinedload

from sqlalchemy.orm import aliased

parent_alias = aliased(PredefinedMaster)
predefined_alias = aliased(PredefinedMaster)


def create_entity(data):

    with session_scope() as session:
        new_predefined = PredefinedMaster(**data)
        db.session.add(new_predefined)
        db.session.commit()
        predefined_id = new_predefined.id
        # if file is not None:
        #     upload_predefined_docs(new_predefined, file)
        return {"message": "predefined saved successfully", "id": predefined_id}, 201


def get_all_entities(data):
    # with session_scope() as session:
    # Default values
    is_sort = data.get("is_sort", False)
    page = data.get("page_number", None)
    size = data.get("page_size", None)

    query = (
        db.session.query(predefined_alias)
        .filter(predefined_alias.is_delete == False)
        .options(joinedload(predefined_alias.parent))
    )
    query = query_criteria(query, data)  # Apply filters
    # Grouping by predefined_alias.id
    query = query.group_by(predefined_alias.id)

    # Sorting logic
    if is_sort:
        query = query.order_by(asc(predefined_alias.sequence_order))
    else:
        query = query.order_by(
            case(
                (
                    predefined_alias.name.op("REGEXP")("^[0-9]+$"),
                    cast(predefined_alias.name, Double),
                ),
                else_=predefined_alias.name,
            ).asc()
        )
    total_records = query.count()  # Get total count before pagination
    # Apply pagination if page and size are valid
    if page is not None and size is not None:
        if size > 0:
            query = query.limit(size).offset((page - 1) * size)

    data_list = query.all()
    size = 0 if size is None else size
    return {
        "data": data_list,
        "total": total_records,
        "page": page,
        "page_size": size,
        "total_pages": (total_records + max(size, 1) - 1) // max(size, 1),
    }


def query_criteria(query, data):
    parent_id = data.get("parent_id")
    search_by = data.get("search_by")
    entity_type = data.get("entity_type")
    code = data.get("code")
    sub_entity = data.get("sub_entity")
    is_active = data.get("is_active")

    if parent_id is not None:
        query = query.filter(predefined_alias.parent_id == parent_id)
    if entity_type is not None:
        query = query.filter(predefined_alias.entity_type == entity_type)
    # if sub_entity is not None:
    #     query = query.filter(predefined_alias.sub_entity == sub_entity)
    if code is not None:
        query = query.filter(predefined_alias.code == code)

    if is_active is not None:
        query = query.filter(predefined_alias.is_active == is_active)
    if search_by is not None:
        search_by = data.get("search_by")
        query = query.filter(
            db.or_(
                db.func.lower(predefined_alias.name).ilike(f"%{search_by}%"),
                db.func.lower(predefined_alias.code).ilike(f"%{search_by}%"),
            )
        )

    return query


def get_entity_by_id(predefined_id):
    data = PredefinedMaster.query.get_or_404(predefined_id)
    return data


def update_entity(id, data):
    predefined = get_entity_by_id(id)
    if predefined is not None:
        set_object_id_exists(predefined, PredefinedMaster, data)
        db.session.commit()
        return {"message": "predefined updated successfully"}, 200
    else:
        raise CustomException(status_code=404, message="Predefined Not found")


def change_status(id):
    predefined = get_entity_by_id(id)
    if not predefined:
        raise CustomException(status_code=404, message="Predefined Not Found")

    # Toggle status
    predefined.is_active = not predefined.is_active

    # Fetch and update child predefined entities in one query
    predefined_ids = (
        PredefinedMaster.query.with_entities(PredefinedMaster.id)
        .filter_by(parent_id=predefined.id)
        .all()
    )

    if predefined_ids:
        PredefinedMaster.query.filter(
            PredefinedMaster.id.in_([pid[0] for pid in predefined_ids])
        ).update({"is_active": predefined.is_active}, synchronize_session=False)

    # Commit changes efficiently
    db.session.add(predefined)
    db.session.commit()
    res_msg = "activated" if predefined.is_active else "deactivated"
    return {"message": f"{predefined.name} {res_msg} successfully"}, 200


def soft_delete(id):
    predefined = get_entity_by_id(id)
    predefined.is_delete = True if predefined.is_delete == False else False
    predefined.is_active = False if predefined.is_active == True else True
    predefined_ids = [
        pd.predefined_id
        for pd in PredefinedMaster.query.filter_by(parent_id=predefined.id).all()
    ]
    PredefinedMaster.query.filter(PredefinedMaster.id.in_(predefined_ids)).update(
        {"is_delete": predefined.is_delete, "is_active": predefined.is_active}
    )
    db.session.commit()

    return {"message": "Delete Successfully"}
