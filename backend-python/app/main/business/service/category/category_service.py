from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import asc
from app.extensions import db, session_scope
from app.main.business.model.category.category_master import Category
from app.main.exceptation.custom_exception import CustomException
from app.main.utils.model.document_master import DocumentMaster
from app.main.utils.service.document_service import upload_document
import json, traceback


def create_entity(data, image):
    try:
        with session_scope() as session:
            print("data", data)
            category = Category(**data)
            print("category", category.__dict__)
            session.add(category)
            session.flush()  # Ensures new_user.id is available

            # Upload Image if provided
            if image:
                document_master = upload_document(
                    file=image, base_directory="category", entity_type="CATEGORY-IMAGE"
                )
                if isinstance(document_master, DocumentMaster):
                    category.category_img_id = document_master.id
                else:
                    return document_master

            # update_user_access(new_user, session)
            session.commit()

            return {
                "message": "User Registered Successfully",
                "user_id": category.id,
            }, 201

    except CustomException as e:
        session.rollback()
        # current_app.logger.exception(e)
        raise CustomException(status_code=400, message=e.message)

    except Exception as e:
        traceback.print_exc()
        session.rollback()
        # current_app.logger.exception(e)
        raise CustomException(status_code=500, message=str(e))


# def create_entity(data, image):
#     """Create a new category."""
#     with session_scope() as session:
#         existing_category = (
#             session.query(Category)
#             .filter(
#                 db.func.lower(Category.name) == data["name"].lower(),
#                 Category.is_delete == False,
#             )
#             .first()
#         )

#         if existing_category:
#             raise CustomException(status_code=400, message="Category already exists")

#         entity = Category(**data)
#         session.add(entity)
#         session.commit()
#         return {
#             "message": "Category created successfully",
#             "id": entity.id,
#         }, 201


def get_all_entities(data):
    """Retrieve all categories with optional pagination and search."""
    page = data.get("page_number", 1)
    size = data.get("page_size", 0)
    search_by = data.get("search_by")

    query = db.session.query(Category).filter(Category.is_delete == False)

    if search_by:
        query = query.filter(db.func.lower(Category.name).ilike(f"%{search_by}%"))

    total_records = query.count()

    if size > 0:
        query = query.limit(size).offset((page - 1) * size)

    data_list = query.order_by(asc(Category.id)).all()

    return {
        "data": data_list,
        "total": total_records,
        "page": page,
        "page_size": size,
        "total_pages": (total_records + max(size, 1) - 1) // max(size, 1),
    }


def get_entity_by_id(entity_id):
    """Retrieve a specific category by ID."""
    entity = Category.query.get_or_404(entity_id)
    return entity


def update_entity(id, data, image):
    """Update a category."""
    entity = get_entity_by_id(id)
    if entity:
        for key, value in data.items():
            setattr(entity, key, value)
        db.session.flush()
        if image:
            document_master = upload_document(
                file=image,
                base_directory="category",
                entity_type="CATEGORY-IMAGE",
                old_document_id=entity.catgory_img_id,
            )
            # if isinstance(document_master, DocumentMaster):
            #     entity.category_img_id = document_master.id
            # else:
            #     return document_master
        db.session.commit()
        return {"message": "Category updated successfully"}, 200
    else:
        raise CustomException(status_code=404, message="Category not found")


def change_status(id):
    """Toggle active status of a category."""
    entity = get_entity_by_id(id)
    if not entity:
        raise CustomException(status_code=404, message="Category not found")

    entity.is_active = not entity.is_active
    db.session.commit()
    res_msg = "activated" if entity.is_active else "deactivated"
    return {"message": f"Category {res_msg} successfully"}, 200


def soft_delete(id):
    """Soft delete a category."""
    entity = get_entity_by_id(id)
    entity.is_delete = not entity.is_delete
    entity.is_active = not entity.is_active
    db.session.commit()
    return {"message": "Category deleted successfully"}
