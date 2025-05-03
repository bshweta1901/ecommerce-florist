from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import asc
from app.extensions import db, session_scope
from app.main.business.model.category.sub_category import SubCategory
from app.main.exceptation.custom_exception import CustomException
from app.extensions import db, session_scope
from app.main.utils.model.document_master import DocumentMaster
from app.main.utils.service.document_service import upload_document


def create_entity(data, image):
    """Create a new subcategory."""
    with session_scope() as session:
        existing_sub_category = (
            session.query(SubCategory)
            .filter(
                db.func.lower(SubCategory.name) == data["name"].lower(),
                SubCategory.category_id == data["category_id"],
                SubCategory.is_delete == False,
            )
            .first()
        )
        if existing_sub_category:
            raise CustomException(status_code=400, message="SubCategory already exists")

        entity = SubCategory(**data)
        session.add(entity)
        session.flush()

        if image:
            document_master = upload_document(
                file=image,
                base_directory="sub-category",
                entity_type="Sub-CATEGORY-IMAGE",
            )
            if isinstance(document_master, DocumentMaster):
                entity.sub_category_img_id = document_master.id
            else:
                return document_master

        session.commit()
        return {
            "message": "SubCategory created successfully",
            "id": entity.id,
        }, 201


def get_all_entities(data):
    """Retrieve all subcategories with optional pagination and search."""
    page = data.get("page_number", 1)
    size = data.get("page_size", 0)
    search_by = data.get("search_by")
    category_id = data.get("category_id")

    query = db.session.query(SubCategory).filter(SubCategory.is_delete == False)

    if search_by:
        query = query.filter(db.func.lower(SubCategory.name).ilike(f"%{search_by}%"))

    if category_id:
        query = query.filter(SubCategory.category_id == category_id)

    total_records = query.count()

    if size > 0:
        query = query.limit(size).offset((page - 1) * size)

    data_list = query.order_by(asc(SubCategory.id)).all()

    return {
        "data": data_list,
        "total": total_records,
        "page": page,
        "page_size": size,
        "total_pages": (total_records + max(size, 1) - 1) // max(size, 1),
    }


def get_entity_by_id(entity_id):
    """Retrieve a specific subcategory by ID."""
    entity = SubCategory.query.get_or_404(entity_id)
    return entity


def update_entity(id, data):
    """Update a subcategory."""
    entity = get_entity_by_id(id)
    if entity:
        for key, value in data.items():
            setattr(entity, key, value)
        db.session.commit()
        return {"message": "SubCategory updated successfully"}, 200
    else:
        raise CustomException(status_code=404, message="SubCategory not found")


def change_status(id):
    """Toggle active status of a subcategory."""
    entity = get_entity_by_id(id)
    if not entity:
        raise CustomException(status_code=404, message="SubCategory not found")

    entity.is_active = not entity.is_active
    db.session.commit()
    res_msg = "activated" if entity.is_active else "deactivated"
    return {"message": f"SubCategory {res_msg} successfully"}, 200


def soft_delete(id):
    """Soft delete a subcategory."""
    entity = get_entity_by_id(id)
    entity.is_delete = not entity.is_delete
    entity.is_active = not entity.is_active
    db.session.commit()
    return {"message": "SubCategory deleted successfully"}
