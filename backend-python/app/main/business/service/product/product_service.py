from sqlalchemy import asc
from app.extensions import session_scope
from app.main.business.model.product.product_document import ProductDocument
from app.main.business.model.product.product_master import ProductMaster
from app.main.exceptation.custom_exception import CustomException
from app.main.utils.model.document_master import DocumentMaster
from app.main.utils.service.document_service import (
    upload_and_link_documents,
    upload_document,
)
from app.extensions import db
from sqlalchemy.orm import aliased


product_aliased = aliased(ProductMaster)


def create_entity(data, files, defaultImage):
    try:
        with session_scope() as session:
            sku = data.get("sku")
            if sku is not None:
                existing_product = (
                    session.query(ProductMaster)
                    .filter(ProductMaster.is_delete == False, ProductMaster.sku == sku)
                    .first()
                )
                if existing_product:
                    return {"message": "Product SKU already exists"}, 400

            price = data.get("price")
            offer_price = data.get("offer_price")

            if price is not None and offer_price is not None:
                if offer_price > price:
                    return {"message": "Offer Price should be less than MRP Price"}, 400

            # Create and persist the product
            product = ProductMaster(**data)
            session.add(product)
            session.flush()  # To get product.id
            if defaultImage:
                # Upload the file and create a document
                document_master = upload_document(
                    defaultImage, "uploads/products/", "product", session
                )
                doc = ProductDocument(
                    document_id=document_master.id,
                    product_id=product.id,
                    is_default=True,
                )
                session.add(doc)
                session.flush()

            if files:
                for file in files:
                    # Upload the file and create a document
                    document_master = upload_document(
                        file, "uploads/products/", "product", session
                    )
                    doc = ProductDocument(
                        document_id=document_master.id, product_id=product.id
                    )
                    session.add(doc)
                    session.flush()
            session.commit()

            return {
                "message": "Product saved successfully",
                "product_id": product.id,
            }, 201

    except CustomException as e:
        raise CustomException(str(e), 500)
    except Exception as e:
        raise CustomException(str(e), 500)


def update_entity(id, data, files, defaultImage):
    entity = ProductMaster.query.filter_by(id=id, is_delete=False).first()

    if not entity:
        return {"message": "Product not found."}, 404
    with session_scope() as session:
        # Update ProductDocument entries
        session.query(ProductDocument).filter(ProductDocument.product_id == id).update(
            {ProductDocument.is_default: False}, synchronize_session=False
        )
        for key, value in data.items():
            setattr(entity, key, value)
        session.merge(entity)
        session.flush()
        if data.get("default_image_id"):
            session.query(ProductDocument).filter(
                ProductDocument.id == data.get("default_image_id")
            ).update({ProductDocument.is_default: True}, synchronize_session=False)
        if defaultImage:
            # Upload the file and create a document
            document_master = upload_document(
                defaultImage, "uploads/products/", "product", session
            )
            doc = ProductDocument(
                document_id=document_master.id, product_id=id, is_default=True
            )
            session.add(doc)
            session.flush()
        if files:
            for file in files:
                # Upload the file and create a document
                document_master = upload_document(
                    file, "uploads/products/", "product", session
                )
                doc = ProductDocument(document_id=document_master.id, product_id=id)
                session.add(doc)
                session.flush()
        session.merge(entity)
        session.commit()

    return {"message": "Product updated successfully."}, 200


def get_all_entities(data):
    """Retrieve all products with optional pagination."""
    page = data.get("page_number", 1)
    size = data.get("page_size", 0)

    query = db.session.query(product_aliased)
    query = query_criteria(query, data)
    total_records = query.count()

    if size > 0:
        query = query.limit(size).offset((page - 1) * size)

    data_list = query.order_by(asc(product_aliased.id)).all()

    return {
        "data": data_list,
        "total": total_records,
        "page": page,
        "page_size": size,
        "total_pages": (total_records + max(size, 1) - 1) // max(size, 1),
    }


def query_criteria(query, data):
    """Apply filters to the product query."""
    search_by = data.get("search_by")
    is_active = data.get("is_active")
    is_add_on = data.get("is_add_on")
    query = query.filter(product_aliased.is_delete == False)

    if search_by:
        query = query.filter(product_aliased.product_name.ilike(f"%{search_by}%"))

    if is_active is not None:
        query = query.filter(product_aliased.is_active == is_active)
    if is_add_on is not None:
        query = query.filter(product_aliased.is_add_on == is_add_on)

    return query


def get_entity_by_id(entity_id):
    """Retrieve a specific product by ID."""
    entity = ProductMaster.query.get_or_404(entity_id)
    return entity


def remove_product_img(product_document_ids):
    with session_scope() as session:
        # Update ProductDocument entries
        session.query(ProductDocument).filter(
            ProductDocument.id.in_(product_document_ids)
        ).update({ProductDocument.is_delete: True}, synchronize_session=False)

        # Get related DocumentMaster IDs
        document_ids = (
            session.query(ProductDocument.document_id)
            .filter(ProductDocument.id.in_(product_document_ids))
            .all()
        )
        document_ids = [doc_id for (doc_id,) in document_ids]

        # Update DocumentMaster entries
        session.query(DocumentMaster).filter(
            DocumentMaster.id.in_(document_ids)
        ).update({DocumentMaster.is_delete: True}, synchronize_session=False)

        session.commit()
        return {"message": "Remove saved successfully"}


def change_status(id):
    """Toggle active status of a product."""
    entity = get_entity_by_id(id)
    if not entity:
        raise CustomException(status_code=404, message="Product not found")

    entity.is_active = not entity.is_active
    db.session.commit()
    res_msg = "activated" if entity.is_active else "deactivated"
    return {"message": f"Product {res_msg} successfully"}, 200


def soft_delete(id):
    """Soft delete a product."""
    entity = get_entity_by_id(id)
    if not entity:
        raise CustomException(status_code=404, message="Product not found")

    entity.is_delete = not entity.is_delete
    entity.is_active = False  # Also deactivate when soft deleting
    db.session.commit()
    return {"message": "Product deleted successfully"}
