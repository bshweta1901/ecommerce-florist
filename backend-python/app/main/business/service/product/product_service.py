from ....business.product.model.product_master import ProductMaster
from .model.product_master import ProductMaster
from .model.product_document import ProductDocument
from .model.product_feature import ProductFeature
from .model.product_fitment import ProductFitment
from .model.city_price import CityPrice
from ....user.model.user import User
from ...cart.model.cart_item import CartItem
from .model.product_master import ProductMaster
from ...company.model.company_price import CompanyPrice
from app import db
from ....utils.model.document_master import DocumentMaster
import datetime
from sqlalchemy.orm import aliased
from sqlalchemy import case, literal_column, and_, or_
from ...service_point.model.service_user import ServiceUser
from ...service_point.model.service_point_price import ServicePointPrice
from ...company.model.company_user import CompanyUser
import os
from flask import current_app
from .model.product_feature import ProductFeature
from ....utils.service.document_service import (
    validate_file_format,
    save_multipart_file_and_get_path,
    get_file_type,
    save_document,
)
from ....utils.service.document_service import (
    validate_file_format,
    save_multipart_file_and_get_path,
    get_file_type,
    save_document,
)
from flask_restx import abort
from ....utils.model.predefined_master import PredefinedMaster
from sqlalchemy import case
from ....utils.service.predefined_service import (
    get_predefined_by_type_and_name,
)
from ....utils.service.excel_utils import check_file_type_import
import pandas as pd
from .util.product_contsant import (
    CATEGORY_ENTITY_TYPE,
    BRAND_ENTITY_TYPE,
    TYER_TYPE_ENTITY_TYPE,
    WIDTH_ENTITY_TYPE,
    ASPECT_ENTITY_TYPE,
    RIM_ENTITY_TYPE,
    TYRE_CONSTRUCTION_ENTITY_TYPE,
    GST_ENTITY_TYPE,
    TYRE_POSTION_ENTITY_TYPE,
    FEATURE_ENTITY_TYPE,
    PRODUCT_TYPE_ENTITY,
)


def create_product(data, user, files):
    slug = data.get("slug")
    gst_id = data.get("gst_id")
    if slug is not None:
        product = ProductMaster.query.filter(
            ProductMaster.is_delete == "N", ProductMaster.slug == slug
        ).first()

        if product is not None:
            abort(400, error="Product slug is already Exist")
    product_offer_price = data.get("product_offer_price", None)
    product_price = data.get("product_price", None)
    if product_price is not None and product_offer_price is not None:
        if product_offer_price > product_price:
            return {"message": "Offer Price should be less than MRP Price "}, 400
    if gst_id is not None:
        product_gst_amount = (
            PredefinedMaster.query.with_entities(PredefinedMaster.name)
            .filter(PredefinedMaster.predefined_id == gst_id)
            .first()
        )
        if None not in product_gst_amount:
            product_gst_str = product_gst_amount[0]
            product_gst = int(product_gst_str.rstrip("%"))

            data.get["product_gst"] = product_gst
    # Create a new product instance
    product = ProductMaster(
        product_name=data["product_name"],
        warranty=data.get("warranty"),
        width_id=data.get("width_id"),
        rating=data.get("rating"),
        aspect_ratio_id=data["aspect_ratio_id"],
        rim_id=data["rim_id"],
        key_feature=data.get("key_feature"),
        fit_in_vehicle_name=data.get("fit_in_vehicle_name"),
        product_price=data["product_price"],
        ply_rating=data["ply_rating"],
        product_offer_price=data.get(
            "product_offer_price", None
        ),  # Use get to handle the case when it's not provided
        make_id=data.get("make_id"),
        model_id=data.get("model_id"),
        category_id=data.get("category_id"),
        brand_id=data["brand_id"],
        tyer_type_id=data["tyer_type_id"],
        product_type_id=data["product_type_id"],
        tyer_ps_id=data["tyer_ps_id"],
        variant_id=data.get("variant_id"),
        product_img=data.get(
            "product_img"
        ),  # Use get to handle the case when it's not provided
        description=data.get(
            "description"
        ),  # Use get to handle the case when it's not provided
        hsn_code=data.get("hsn_code"),
        purchase_price=data.get("purchase_price"),
        product_gst=data.get("product_gst"),
        compatible_vehicles=data.get("compatible_vehicles", None),
        slug=data.get("slug", None),
        tyre_construction_id=data.get("tyre_construction_id", None),
        entity_type=data.get("entity_type", None),
        gst_id=data.get("gst_id", None),
    )

    # Save the product to the database
    # product.save()
    # db.session.add(product)
    # db.session.flush()
    # Retrieve the ID of the saved product
    product_id = product.product_id
    product_features_list = []
    if data.get("feature_ids") is not None:
        for feature in data.get("feature_ids"):
            product_feat = ProductFeature(feature_id=feature, product_id=product_id)
            product_features_list.append(product_feat)
    # Assign the product features to the product master
    product.product_feature = product_features_list
    # db.session.add(product_feat)
    # db.session.flush()
    db.session.add(product)
    db.session.commit()
    product_id = product.product_id
    if files is not None:
        for file in files:
            upload_product_docs(product_id, file)

    return {"message": "Product saved successfully", "product_id": product_id}, 201


def upload_product_docs(product_id, file):
    try:
        folder_path = os.path.join(
            current_app.config["DOCUMENT_TEMP_UPLOAD"],
            "mechmiles-doc/product/" + str(product_id),
        )
        # file = request.files["file"]

        validate_file_format(file, "Upload-Doc")
        document_master = save_multipart_file_and_get_path(
            file, folder_path, file_name=None
        )
        document_master.entity_name = "COMPANY_SIGNATURE_DOC"
        document_master.file_type = get_file_type(document_master.file_path)
        document_master.is_delete = "N"
        document_master.is_deactivate = "N"
        # Replace the following line with your actual implementation of save_document_master
        document_master = save_document(document_master)
        product_document = ProductDocument(
            product_id=product_id, document_id=document_master.document_id
        )
        product_document.save()

        # Perform operations with the uploaded file path (file_path)
        # For simplicity, just printing the file path
        print(
            f"Company ID: {product_id}, Document Type: {file.mimetype}, File Path: {folder_path}"
        )

        return {"message": "File uploaded successfully"}, 201

    except Exception as e:
        return {"error": str(e)}, 500


def get_service_product_list(data, user):
    sort_by = data.get("sort_by", None)
    is_user = data.get("is_user", None)
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    products = None
    query = (
        ProductMaster.query.filter(ProductMaster.is_delete == "N")
        .outerjoin(
            ProductDocument, ProductDocument.product_id == ProductMaster.product_id
        )
        .outerjoin(
            ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        )
    )

    query = query_criteria(query, data)
    if sort_by is not None:
        if sort_by:
            if sort_by == "ASC":
                # Sort in ascending order
                query = query.order_by(ProductMaster.product_offer_price.asc())
            elif sort_by == "DESC":
                # Sort in descending order
                query = query.order_by(ProductMaster.product_offer_price.desc())
            elif sort_by == "POPULAR":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)
            elif sort_by == "RECOMMENDED":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)

    else:
        # If no specific sorting is specified, default to sorting by product_id in descending order
        query = query.order_by(ProductMaster.product_id.desc())

    if page_number is not None and page_size is not None:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

        query = query.limit(page_size)  # Apply LIMIT based on page_size
        if page_number > 1:
            offset = (page_number - 1) * page_size
            query = query.offset(offset)
        products = query.all()
    else:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

    products = query.all()
    # user_id = user.id
    if is_user:
        for product in products:
            product._is_wishlist = None  # Reset the cached value
            _ = product.is_wishlist  # Access the property to calculate the value

    return products


def get_product_list(data, user):
    sort_by = data.get("sort_by", None)
    is_user = True if data.get("user_id") != None else False
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    products = None
    company_user = None
    price_range_from = data.get("price_range_from", None)
    price_range_to = data.get("price_range_to", None)
    if data.get("city_id") is not None and data.get("city_id") != 0:
        return get_products_with_city_pricing(data=data)
    cart_item_alias = aliased(CartItem, name="cart_item_alias")
    if is_user:
        company_user = CompanyUser.query.filter_by(user_id=user.id).first()

    query = (
        ProductMaster.query.filter(ProductMaster.is_delete == "N")
        # .outerjoin(
        #     ProductDocument, ProductDocument.product_id == ProductMaster.product_id
        # )
        .outerjoin(
            ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        )
    )
    if company_user != None:
        query = query.join(
            CompanyPrice, CompanyPrice.product_id == ProductMaster.product_id
        )
    query = query_criteria(query, data)
    if company_user != None:
        query = query.filter(
            and_(
                CompanyPrice.is_delete == "N",
                # ProductFeature.is_delete == "N",
                or_(
                    company_user is None,
                    CompanyPrice.company_id.in_([company_user.company_id]),
                ),
            ),
        )
    if price_range_from is not None:
        if company_user is not None:
            query = query.filter(CompanyPrice.price >= price_range_from)
        else:
            query = query.filter(
                case(
                    (
                        ProductMaster.product_offer_price.isnot(None),
                        ProductMaster.product_offer_price,
                    ),
                    else_=ProductMaster.product_price,
                )
                >= price_range_from
            )
    if price_range_to is not None:
        if company_user is not None:
            query = query.filter(CompanyPrice.price <= price_range_to)
        else:
            query = query.filter(
                case(
                    (
                        ProductMaster.product_offer_price.isnot(None),
                        ProductMaster.product_offer_price,
                    ),
                    else_=ProductMaster.product_price,
                )
                <= price_range_to
            )
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    query = query.filter(ProductMaster.is_delete == "N")
    if sort_by is not None:
        if sort_by:
            if sort_by == "ASC":
                # Sort in ascending order
                query = query.order_by(ProductMaster.product_offer_price.asc())
            elif sort_by == "DESC":
                # Sort in descending order
                query = query.order_by(ProductMaster.product_offer_price.desc())
            elif sort_by == "POPULAR":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)
            elif sort_by == "RECOMMENDED":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)

    else:
        # If no specific sorting is specified, default to sorting by product_id in descending order
        query = query.order_by(ProductMaster.product_id.desc())

    if page_number is not None and page_size is not None:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

        query = query.limit(page_size)  # Apply LIMIT based on page_size
        if page_number > 1:
            offset = (page_number - 1) * page_size
            query = query.offset(offset)
        products = query.all()
    else:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

    # products_count = query.count()
    products = query.all()
    # user_id = user.id
    if is_user:
        for product in products:
            product.user_id = user.id
            product._is_wishlist = None  # Reset the cached value
            _ = product.is_wishlist  # Access the property to calculate the value
            product._is_goto = None
            _ = product.is_goto  # Access the property to calculate the value
            product._offer_price = None
            _ = product.offer_price  # Access the property to calculate the value
    else:
        for product in products:
            product._offer_price = None
            _ = product.offer_price  # Access the property to calculate the value

    return products


def get_sp_product_list(data, user):
    sort_by = data.get("sort_by", None)
    is_user = True if data.get("user_id") != None else False
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    products = None
    if data.get("city_id") is not None and data.get("city_id") != 0:
        return get_products_with_city_pricing(data=data)
    cart_item_alias = aliased(CartItem, name="cart_item_alias")

    query = (
        ProductMaster.query.filter(ProductMaster.is_delete == "N")
        .outerjoin(
            ProductDocument, ProductDocument.product_id == ProductMaster.product_id
        )
        .outerjoin(
            ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        )
    )

    query = query_criteria(query, data)
    if user != None:
        service_point_user = ServiceUser.query.filter_by(user_id=user.id).first()

        query = query.filter(
            ProductMaster.product_id.in_(
                db.session.query(ServicePointPrice.product_id)
            ),
            ServicePointPrice.service_point_id.in_(
                [service_point_user.service_point_id]
            ),
        )
    if sort_by is not None:
        if sort_by:
            if sort_by == "ASC":
                # Sort in ascending order
                query = query.order_by(ProductMaster.product_price.asc())
            elif sort_by == "DESC":
                # Sort in descending order
                query = query.order_by(ProductMaster.product_price.desc())
            elif sort_by == "POPULAR":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)
            elif sort_by == "RECOMMENDED":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)

    else:
        # If no specific sorting is specified, default to sorting by product_id in descending order
        query = query.order_by(ProductMaster.product_id.desc())

    if page_number is not None and page_size is not None:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

        query = query.limit(page_size)  # Apply LIMIT based on page_size
        if page_number > 1:
            offset = (page_number - 1) * page_size
            query = query.offset(offset)
        products = query.all()
    else:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

    products = query.all()

    # user_id = user.id
    if is_user:
        for product in products:
            product.user_id = user.id
            product._is_wishlist = None  # Reset the cached value
            _ = product.is_wishlist  # Access the property to calculate the value
            product._is_goto = None
            _ = product.is_goto  # Access the property to calculate the value
            product._offer_price = None
            _ = product.offer_price  # Access the property to calculate the value
    else:
        for product in products:
            product._offer_price = None
            _ = product.offer_price  # Access the property to calculate the value
    return products


def get_products_with_city_pricing(data):
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    city_price_alias = aliased(CityPrice)
    products_with_discount = (
        db.session.query(ProductMaster, city_price_alias.price_percentage)
        .outerjoin(
            city_price_alias, (ProductMaster.product_id == city_price_alias.product_id)
        )
        .filter(ProductMaster.is_delete == "N")
        .all()
    )

    # Calculate discounted price based on the presence of offer_price
    discounted_products = []
    for product, percent_discount in products_with_discount:
        if percent_discount is not None:
            if city_price_alias and (product.product_offer_price is not None):
                discounted_price = product.product_offer_price * (
                    1 - percent_discount / 100
                )
            else:
                discounted_price = product.product_price * (1 - percent_discount / 100)
            product.discounted_price = discounted_price
        discounted_products.append(product)

        # query = (
        # db.session.query(
        #     ProductMaster,
        #     case(
        #         (
        #             CompanyPrice.price_percentage.isnot(None) & ProductMaster.product_offer_price.isnot(None),
        #             literal_column("((product_offer_price * price_percentage) / 100) + product_offer_price")
        #         ),
        #         (
        #             CompanyPrice.price_percentage.isnot(None) & ProductMaster.product_offer_price.is_(None),
        #             literal_column("((product_price * price_percentage) / 100) + product_price")
        #         ),
        #         (
        #             CompanyPrice.price_percentage.is_(None) & ProductMaster.product_offer_price.isnot(None),
        #             literal_column("product_offer_price")
        #         ),
        #         (
        #             CompanyPrice.price_percentage.is_(None) & ProductMaster.product_offer_price.is_(None),
        #             literal_column("product_price")
        #         ),
        #      else_=literal_column("NULL")).label('discounted_price')
        # )
        # .filter(ProductMaster.is_delete == 'N')
        # )

        # # Join with CompanyPrice if company_id is provided
        # # if data.get('company_id') is not None and data.get('company_id') != 0:
        # query = query.outerjoin(CompanyPrice, CompanyPrice.product_id == ProductMaster.product_id)
        query = (
            db.session.query(
                ProductMaster,
                case(
                    (
                        and_(
                            CompanyPrice.price_percentage.isnot(None),
                            ProductMaster.product_offer_price.isnot(None),
                        ),
                        literal_column(
                            "((product_offer_price * company_price.price_percentage) / 100) + product_offer_price"
                        ),
                    ),
                    (
                        and_(
                            CompanyPrice.price_percentage.isnot(None),
                            ProductMaster.product_offer_price.is_(None),
                        ),
                        literal_column(
                            "((product_price * company_price.price_percentage) / 100) + product_price"
                        ),
                    ),
                    (
                        and_(
                            CompanyPrice.price_percentage.is_(None),
                            ProductMaster.product_offer_price.isnot(None),
                        ),
                        literal_column("product_offer_price"),
                    ),
                    (
                        and_(
                            CompanyPrice.price_percentage.is_(None),
                            ProductMaster.product_offer_price.is_(None),
                        ),
                        literal_column("product_price"),
                    ),
                    else_=case(
                        (
                            CityPrice.price_percentage.isnot(None),
                            literal_column(
                                "city_price.price_percentage * (1 + city_price.price_percentage / 100)"
                            ),
                        ),
                        (
                            and_(
                                CityPrice.price_percentage.is_(None),
                                CompanyPrice.price_percentage.isnot(None),
                            ),
                            literal_column(
                                "product_price * (1 + city_price.price_percentage / 100)"
                            ),
                        ),
                        (
                            or_(
                                CityPrice.price_percentage.is_(None),
                                CompanyPrice.price_percentage.is_(None),
                            ),
                            literal_column("product_price"),
                        ),
                        else_=literal_column("NULL"),
                    ),
                ).label("discounted_price"),
            )
            .filter(ProductMaster.is_delete == "N")
            .outerjoin(CityPrice, CityPrice.product_id == ProductMaster.product_id)
            .outerjoin(
                CompanyPrice, CompanyPrice.product_id == ProductMaster.product_id
            )
            .outerjoin(
                ProductDocument, ProductDocument.product_id == ProductMaster.product_id
            )
            .outerjoin(
                ProductFeature, ProductFeature.product_id == ProductMaster.product_id
            )
        )
    # Check for city_id or user_id in the response
    if data.get("city_id") is not None:
        query = query.filter(CityPrice.city_id == data["city_id"])
    elif data.get("user_id") is not None:
        query = query.filter(CompanyPrice.user_id == data["user_id"])

    sort_by = data.get("sort_by")

    query = query_criteria(query, data)
    if page_number is not None and page_size is not None:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

        query = query.limit(page_size)  # Apply LIMIT based on page_size
        if page_number > 1:
            offset = (page_number - 1) * page_size
            query = query.offset(offset)
        products = query.all()

    if sort_by is not None:
        if sort_by:
            if sort_by == "ASC":
                # Sort in ascending order
                query = query.order_by(ProductMaster.product_price.asc())
            elif sort_by == "DESC":
                # Sort in descending order
                query = query.order_by(ProductMaster.product_price.desc())
            elif sort_by == "POPULAR":
                # Sort in popular order
                query = query.filter_by(ProductMaster.entity_type == sort_by)
            elif sort_by == "RECOMMENDED":
                # Sort in popular order
                query = query.filter_by(ProductMaster.entity_type == sort_by)

    else:
        # If no specific sorting is specified, default to sorting by product_id in descending order
        query = query.order_by(ProductMaster.product_id.desc())
    # Fetch the results
    products_with_discount = query.all()
    # Fetch the results
    # products_with_discount = query.all()

    # Extracting the products and discounted prices
    result = []
    for product, discounted_price in products_with_discount:
        # Convert discounted_price to Python float or set it to None
        discounted_price = (
            float(discounted_price) if discounted_price is not None else None
        )
        result.append(product)

    # product = ProductMaster.query.filter(ProductMaster.is_delete == 'N').all()
    return discounted_products


def get_sp_product_list(data, user):

    sort_by = data.get("sort_by", None)
    is_user = True if data.get("user_id") != None else False
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    products = None
    if data.get("city_id") is not None and data.get("city_id") != 0:
        return get_products_with_city_pricing(data=data)
    cart_item_alias = aliased(CartItem, name="cart_item_alias")

    query = (
        ProductMaster.query.filter(ProductMaster.is_delete == "N")
        .outerjoin(
            ProductDocument,
            (ProductDocument.product_id == ProductMaster.product_id)
            & (ProductDocument.is_delete == "N"),
        )
        .outerjoin(
            ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        )
        # .filter(ProductMaster.is_delete == "N")
    )
    if data.get("service_point_id") is None:
        abort(400, error="Service Point Id Required")
    if data.get("service_point_id") is not None:
        query = query.join(
            ServicePointPrice,
            ServicePointPrice.product_id == ProductMaster.product_id,
        )
    query = query_criteria(query, data)
    # products = query.all()
    if user != None:
        service_point_user = ServiceUser.query.filter_by(user_id=user.id).first()
    if data.get("service_point_id") is not None:
        query = query.filter(
            ProductMaster.product_id.in_(
                db.session.query(ServicePointPrice.product_id).filter(
                    ServicePointPrice.service_point_id == data.get("service_point_id"),
                    ServicePointPrice.is_delete == "N",
                )
            ),
            #     ServicePointPrice.service_point_id
            #     == service_point_user.service_point_id
        )

    if sort_by is not None:
        if sort_by:
            if sort_by == "ASC":
                # Sort in ascending order
                query = query.order_by(ProductMaster.product_price.asc())
            elif sort_by == "DESC":
                # Sort in descending order
                query = query.order_by(ProductMaster.product_price.desc())
            elif sort_by == "POPULAR":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)
            elif sort_by == "RECOMMENDED":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)

    else:
        # If no specific sorting is specified, default to sorting by product_id in descending order
        query = query.order_by(ProductMaster.product_id.desc())

    if page_number is not None and page_size is not None:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

        query = query.limit(page_size)  # Apply LIMIT based on page_size
        if page_number > 1:
            offset = (page_number - 1) * page_size
            query = query.offset(offset)
        products = query.all()
    else:
        # Remove the redundant group_by statement
        # query.group_by(ProductMaster.product_id)  # Remove this line

        # Use the func module to apply group_by
        query = query.group_by(
            ProductMaster.product_id
        )  # Apply group_by using func module

    products = query.all()

    # for product in products:
    #     for service_point_price in product.product_from_service_point_price:
    #         if service_point_price.service_point_id == data.get("service_point_id"):
    #             product.product_offer_price = service_point_price.price

    # product.offer_price=
    # user_id = user.id
    if is_user:
        for product in products:
            product.user_id = user.id
            product._is_wishlist = None  # Reset the cached value
            _ = product.is_wishlist  # Access the property to calculate the value
            product._is_goto = None
            _ = product.is_goto  # Access the property to calculate the value
            product.service_point_id = data.get("service_point_id")
            product._offer_price = None
            _ = product.offer_price  # Access the property to calculate the value
    else:
        for product in products:
            product._offer_price = None
            _ = product.offer_price  # Access the property to calculate the value
    return products


def get_product_count(data, user):
    sort_by = data.get("sort_by", None)
    is_user = True if data.get("user_id") != None else False
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    products = None
    company_user = None

    if data.get("city_id") is not None and data.get("city_id") != 0:
        return get_products_with_city_pricing(data=data)
    cart_item_alias = aliased(CartItem, name="cart_item_alias")
    if is_user:
        company_user = CompanyUser.query.filter_by(user_id=user.id).first()
    query = (
        ProductMaster.query.filter(ProductMaster.is_delete == "N")
        .outerjoin(
            ProductDocument, ProductDocument.product_id == ProductMaster.product_id
        )
        .outerjoin(
            ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        )
    )
    if company_user != None:
        query = query.join(
            CompanyPrice, CompanyPrice.product_id == ProductMaster.product_id
        )
    query = query_criteria(query, data)

    if company_user != None:
        query = query.filter(
            and_(
                CompanyPrice.is_delete == "N",
                # ProductFeature.is_delete == "N",
                or_(
                    company_user is None,
                    CompanyPrice.company_id.in_([company_user.company_id]),
                ),
            ),
        )

    # else:
    # query.filter(ProductMaster.is_delete == "N")

    if sort_by is not None:
        if sort_by:
            if sort_by == "ASC":
                # Sort in ascending order
                query = query.order_by(ProductMaster.product_price.asc())
            elif sort_by == "DESC":
                # Sort in descending order
                query = query.order_by(ProductMaster.product_price.desc())
            elif sort_by == "POPULAR":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)
            elif sort_by == "RECOMMENDED":
                # Sort in popular order
                query = query.filter(ProductMaster.entity_type == sort_by)

    # else:
    # If no specific sorting is specified, default to sorting by product_id in descending order
    # query = query.order_by(ProductMaster.product_id.desc())

    # if page_number is not None and page_size is not None:
    # Remove the redundant group_by statement
    # query.group_by(ProductMaster.product_id)  # Remove this line

    #     # Use the func module to apply group_by
    # if company_user is not None:
    query = query.group_by(ProductMaster.product_id)  # Apply group_by using func module

    #     query = query.limit(page_size)  # Apply LIMIT based on page_size
    #     if page_number > 1:
    #         offset = (page_number - 1) * page_size
    #         query = query.offset(offset)
    #     total_count = query.count()
    # else:
    # Remove the redundant group_by statement
    # query.group_by(ProductMaster.product_id)  # Remove this line

    # Use the func module to apply group_by
    # query = query.group_by(ProductMaster.product_id)  # Apply group_by using func module

    total_count = query.count()

    return {"count": total_count}


def update_product(product_id, data):
    product_offer_price = data.get("product_offer_price", None)
    product_price = data.get("product_price", None)
    if product_price is not None and product_offer_price is not None:
        if product_offer_price > product_price:
            return {"message": "Offer Price should be less than MRP Price "}, 400
    # Get the product
    # Get the product
    product_gst = data.get("gst_id")
    if product_gst is not None:
        product_gst_amount = (
            PredefinedMaster.query.with_entities(PredefinedMaster.name)
            .filter(PredefinedMaster.predefined_id == product_gst)
            .first()
        )
        if None not in product_gst_amount:
            product_gst_str = product_gst_amount[0]
            product_gst = int(product_gst_str.rstrip("%"))

            data["product_gst"] = product_gst

    product = ProductMaster.query.get(product_id)
    slug = data.get("slug")
    if slug is not None and slug != product.slug:
        product = (
            ProductMaster.query.filter(ProductMaster.is_delete == "N")
            .filter(ProductMaster.slug == slug)
            .first()
        )
        if product is not None:
            abort(400, error="Product slug is already Exist")
    try:
        # Update the product attributes, handling null or empty fields
        for field, value in data.items():
            # Check if the field exists in the ProductMaster model, if the value is not None or an empty string,
            # and if the value is different from the current value in the product object
            if (
                hasattr(product, field)
                and value not in (None, "")
                and getattr(product, field) != value
            ):
                setattr(product, field, value)

        if "feature_ids" in data:
            product_feature_ids = data["feature_ids"]
            # Update or delete existing product features
            if product.product_feature:
                for feature in product.product_feature:
                    if feature.feature_id not in product_feature_ids:
                        feature.is_delete = "Y"
                        db.session.add(feature)
                        db.session.commit()
            # Add new product features
            for feature_id in product_feature_ids:
                # Check if the feature exists in the database
                feature = PredefinedMaster.query.get(feature_id)
                if feature:
                    # Create a new product feature if it doesn't exist
                    product_feature = ProductFeature.query.filter_by(
                        product_id=product_id, feature_id=feature_id, is_delete="N"
                    ).first()
                    if not product_feature:
                        product_feature = ProductFeature(
                            product_id=product_id,
                            feature_id=feature_id,
                        )
                        db.session.add(product_feature)

        # Save the product to the database
        db.session.add(product)
        db.session.commit()
    except Exception as e:
        return {"message": "product update failed"}, 400

    return {"message": "product update successfully", "product_id": product_id}, 200


def query_criteria(query, data):
    created_date_from = data.get("created_date_from", None)
    created_date_to = data.get("created_date_to", None)
    price_range_from = data.get("price_range_from", None)
    price_range_to = data.get("price_range_to", None)
    make_ids = data.get("make_ids", [])
    model_id = data.get("model_ids", [])
    variant_id = data.get("variant_ids", [])
    category_id = data.get("category_ids", [])
    brand_id = data.get("brand_ids", [])
    tyer_type_id = data.get("tyer_type_ids", [])
    tyer_ps_id = data.get("tyer_ps_ids", [])
    width = data.get("width_ids", [])
    aspect_ratio = data.get("aspect_ratio_ids", [])
    rim = data.get("rim_ids", [])
    entity_type = data.get("entity_type", None)
    product_type_id = data.get("product_type_id", None)

    if "variant_ids" in data and data["variant_ids"]:
        variant_id = data["variant_ids"][0]
        if variant_id is not None:
            # Select products that exist in the product_fitment of the particular variant_id
            subquery = (
                db.session.query(ProductFitment.product_id)
                .filter(
                    ProductFitment.variant_id.in_(data["variant_ids"]),
                    ProductFitment.product_id == ProductMaster.product_id,
                )
                .subquery()
            )
            query = query.filter(ProductMaster.product_id.in_(subquery))

    # if "variant_ids" in data and data["variant_ids"]:
    #     variant_id = data["variant_ids"][0]

    #     # Select products that exist in the product_fitment of the particular variant_id
    #     subquery = (
    #         db.session.query(ProductFitment.product_id)
    #         .filter(
    #             ProductFitment.variant_id == variant_id,
    #             ProductFitment.product_id == ProductMaster.product_id,
    #         )
    #         .subquery()
    #     )
    #     query = query.filter(ProductMaster.product_id.in_(subquery))

    search_by = data.get("search_by", None)
    if search_by:
        query = query.filter(db.or_(ProductMaster.product_name.ilike(f"%{search_by}%")))
    if created_date_from:
        if isinstance(created_date_from, str):
            created_date_from = datetime.datetime.strptime(
                created_date_from, "%Y-%m-%d"
            )
        created_date_from = created_date_from.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        query = query.filter(ProductMaster.created_at >= created_date_from)

    if created_date_to:
        if isinstance(created_date_to, str):
            created_date_to = datetime.datetime.strptime(created_date_to, "%Y-%m-%d")
        created_date_to = created_date_to.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        query = query.filter(ProductMaster.created_at <= created_date_to)

    # if make_ids:
    #     query = query.filter(ProductMaster.make_id.in_(make_ids))

    # if model_id:
    #     query = query.filter(ProductMaster.model_id.in_(model_id))

    if category_id:
        query = query.filter(ProductMaster.category_id.in_(category_id))
    if brand_id:
        query = query.filter(ProductMaster.brand_id.in_(brand_id))

    if tyer_type_id:
        query = query.filter(ProductMaster.tyer_type_id.in_(tyer_type_id))
    if tyer_ps_id:
        query = query.filter(ProductMaster.tyer_ps_id.in_(tyer_ps_id))

    if width:
        query = query.filter(ProductMaster.width_id.in_(width))

    if aspect_ratio:
        query = query.filter(ProductMaster.aspect_ratio_id.in_(aspect_ratio))

    if rim:
        query = query.filter(ProductMaster.rim_id.in_(rim))

    if entity_type and entity_type != "LOW-TO-HIGH" and entity_type != "HIGH-TO-LOW":
        query = query.filter(ProductMaster.entity_type == entity_type)

    if product_type_id:
        query = query.filter(ProductMaster.product_type_id == product_type_id)

    return query


def get_product_by_id(product_id):
    cart_item_alias = aliased(CartItem, name="cart_item_alias")

    query = (
        ProductMaster.query.filter(
            ProductMaster.is_delete == "N", ProductMaster.product_id == product_id
        )
        # .outerjoin(
        #     ProductDocument, (ProductDocument.product_id == ProductMaster.product_id)
        # )
        # .outerjoin(
        #     ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        # )
    )
    query = query.filter(ProductDocument.is_delete == "N")
    # query = query.group_by(ProductMaster.product_id)  # Apply group_by using func module
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    products = query.first()
    return products

    # if user != None:
    #     service_point_user = ServiceUser.query.filter_by(user_id=user.id).first()

    #     query = query.filter(
    #         ProductMaster.product_id.in_(
    #             db.session.query(ServicePointPrice.product_id)
    #         ),
    #         ServicePointPrice.service_point_id.in_(
    #             [service_point_user.service_point_id]
    #         ),
    #     )


def get_product_by_slug(slug):
    cart_item_alias = aliased(CartItem, name="cart_item_alias")

    query = (
        ProductMaster.query.filter(
            ProductMaster.is_delete == "N", ProductMaster.slug == slug
        )
        # .outerjoin(
        #     ProductDocument, (ProductDocument.product_id == ProductMaster.product_id)
        # )
        # .outerjoin(
        #     ProductFeature, ProductFeature.product_id == ProductMaster.product_id
        # )
    )
    query = query.filter(ProductDocument.is_delete == "N")
    # query = query.group_by(ProductMaster.product_id)  # Apply group_by using func module
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    products = query.first()
    if products is not None:
        return products
    else:
        abort(400, error="Product Not Found")


def change_status(product_id):
    product = ProductMaster.query.get_or_404(product_id)
    if product.is_deactivate == "N":
        product.is_deactivate = "Y"
    else:
        product.is_deactivate = "N"
        db.session.add(product)
        db.session.commit()


def save_product_fitment(data):

    product_fitment = ProductFitment(
        product_id=data["product_id"],
        variant_id=data["variant_id"],
        product_type_id=data["product_type_id"],
    )
    product = get_product_by_id(data["product_id"])
    if product.category_id is not None:
        product_fitment.category_id = product.category_id
    else:
        product_fitment.category_id = data.get("category_id")
    if (
        product_fitment.category_id is not None
        and product_fitment.product_id is not None
        and product_fitment.variant_id is not None
        and product_fitment.product_type_id is not None
    ):
        query = ProductFitment.query.filter(
            ProductFitment.is_delete == "N",
            ProductFitment.category_id == product_fitment.category_id,
            ProductFitment.product_id == product_fitment.product_id,
            ProductFitment.variant_id == product_fitment.variant_id,
            ProductFitment.product_type_id == product_fitment.product_type_id,
        )

        count = query.count()
        if count > 0:
            abort(500, "data is already exist")
    db.session.add(product_fitment)
    db.session.commit()
    return product_fitment


def update_product_fitment(product_fitment_id, data):

    product_fitment = ProductFitment.query.filter_by(
        product_fitment_id=product_fitment_id
    ).first()

    if (
        product_fitment.category_id is not None
        and product_fitment.product_id is not None
        and product_fitment.variant_id is not None
        and product_fitment.product_type_id is not None
    ):
        query = ProductFitment.query.filter(
            ProductFitment.is_delete == "N",
            ProductFitment.category_id == product_fitment.category_id,
            ProductFitment.product_id == product_fitment.product_id,
            ProductFitment.variant_id == product_fitment.variant_id,
            ProductFitment.product_type_id == product_fitment.product_type_id,
            ProductFitment.product_fitment_id == product_fitment.product_fitment_id,
        )

        count = query.count()
        if count > 0:
            abort(500, "data is already exist")
    product = get_product_by_id(data["product_id"])
    product_fitment.category_id = product.category_id
    product_fitment.variant_id = data["variant_id"]
    product_fitment.product_type_id = data["product_type_id"]
    product_fitment.product_id = data["product_id"]
    db.session.commit()
    return product_fitment


def product_fitment_list(data):
    page_number = data.get("page_number", None)
    page_size = data.get("page_size", None)
    query = ProductFitment.query.filter(
        ProductFitment.is_delete == "N",
    )

    query = product_fitment_query_criteria(query, data)
    query = query.order_by(
        ProductFitment.product_fitment_id.desc()
    )  # Move order_by here
    if page_number is not None and page_size is not None:
        if page_number > 1:
            offset = (page_number - 1) * page_size
            query = query.offset(offset)

        query = query.limit(page_size)

    return query.all()


def product_fitment_count(data):
    query = ProductFitment.query.filter(
        ProductFitment.is_delete == "N",
    )
    query = product_fitment_query_criteria(query, data)
    return query.count()


def product_fitment_query_criteria(query, data):
    if "product_id" in data and data["product_id"] != None:
        query = query.filter(ProductFitment.product_id == data["product_id"])
    if "variant_id" in data and data["variant_id"] != None:
        query = query.filter(ProductFitment.variant_id == data["variant_id"])
    if "category_id" in data and data["category_id"] != None:
        query = query.filter(ProductFitment.category_id == data["category_id"])
    if "product_type_id" in data and data["product_type_id"] != None:
        query = query.filter(ProductFitment.product_type_id == data["product_type_id"])
    return query


def product_fitment_by_id(product_fitment_id):
    return ProductFitment.query.filter_by(product_fitment_id=product_fitment_id).first()


def product_fitment_delete(product_fitment_id):
    product_fitment = ProductFitment.query.filter_by(
        product_fitment_id=product_fitment_id
    ).first()
    product_fitment.is_delete = "Y"
    db.session.commit()
    return product_fitment


def upload_product_img(product_id, file_storages):
    if file_storages is not None:
        for file in file_storages:
            upload_product_docs(product_id, file)


def remove_product_img(product_document_id):
    product_document = ProductDocument.query.get_or_404(product_document_id)
    product_document.is_delete = "Y"
    db.session.add(product_document)
    db.session.flush()
    document = DocumentMaster.query.get_or_404(product_document.document_id)
    document.is_delete = "Y"
    db.session.add(product_document)
    db.session.flush()
    db.session.commit()

    return {"message": "Remove saved successfully"}


def delete_product(product_id):
    try:
        product = ProductMaster.query.get_or_404(product_id)
        # Toggle the status of the appointment
        product.is_delete = "Y" if product.is_delete == "N" else "N"
        # Update company users using ORM
        # Update company users
        # CompanyUser.query.filter_by(company_id=company_id).update(
        #     {"is_deactivate": company.is_deactivate}
        # )

        # Get the user ids associated with the company
        company_price_id = [
            cu.company_price_id
            for cu in CompanyPrice.query.filter_by(product_id=product_id).all()
        ]

        # Update users associated with the company
        CompanyPrice.query.filter(
            CompanyPrice.company_price_id.in_(company_price_id)
        ).update({"is_delete": product.is_delete})

        # db.session.commit()
        # db.session.add(company)
        # Commit the changes to the database
        db.session.commit()
        return {"message": "Delete Successfully"}

    except:
        abort(400, "Company not found")


def import_excel(file):
    df = check_file_type_import(file)
    for index, row in df.iterrows():
        product = {}

        if pd.notna(row[0]):
            product["product_name"] = str(row[0])

        if pd.notna(row[1]):
            category = get_predefined_by_type_and_name(
                CATEGORY_ENTITY_TYPE, str(row[1])
            )
            if category is not None:
                product["category_id"] = category.predefined_id

        if pd.notna(row[2]):
            brand = get_predefined_by_type_and_name(BRAND_ENTITY_TYPE, str(row[2]))
            if brand is not None:
                product["brand_id"] = brand.predefined_id

        if pd.notna(row[3]):
            name = get_predefined_by_type_and_name(TYER_TYPE_ENTITY_TYPE, str(row[3]))
            if name is not None:
                product["tyer_type_id"] = name.predefined_id

        if pd.notna(row[4]):
            name = get_predefined_by_type_and_name(WIDTH_ENTITY_TYPE, str(row[4]))
            if name is not None:
                product["width_id"] = name.predefined_id

        if pd.notna(row[5]):
            name = get_predefined_by_type_and_name(ASPECT_ENTITY_TYPE, str(row[5]))
            if name is not None:
                product["aspect_ratio_id"] = name.predefined_id

        if pd.notna(row[6]):
            name = get_predefined_by_type_and_name(RIM_ENTITY_TYPE, str(row[6]))
            if name is not None:
                product["rim_id"] = name.predefined_id

        if pd.notna(row[7]):
            name = get_predefined_by_type_and_name(
                TYRE_CONSTRUCTION_ENTITY_TYPE, str(row[7])
            )
            if name is not None:
                product["tyre_construction_id"] = name.predefined_id

        if pd.notna(row[8]):
            product["warranty"] = str(row[8])

        if pd.notna(row[9]):
            product["purchase_price"] = str(row[9])

        if pd.notna(row[10]):
            product["product_price"] = str(row[10])

        if pd.notna(row[11]):
            product["product_offer_price"] = str(row[11])

        if pd.notna(row[12]):
            product["slug"] = str(row[12])

        if pd.notna(row[13]):
            product["description"] = str(row[13])

        if pd.notna(row[14]):
            product["key_feature"] = str(row[14])

        if pd.notna(row[15]):
            product["compatible_vehicles"] = str(row[15])

        if pd.notna(row[16]):
            name = get_predefined_by_type_and_name(GST_ENTITY_TYPE, str(row[16]))
            if name is not None:
                product["gst_id"] = name.predefined_id

        if pd.notna(row[17]):
            name = get_predefined_by_type_and_name(
                TYRE_POSTION_ENTITY_TYPE, str(row[17])
            )
            if name is not None:
                product["tyer_ps_id"] = name.predefined_id

        if pd.notna(row[18]):
            product["ply_rating"] = str(row[18])
        if pd.notna(row[19]):
            product["hsn_code"] = str(row[19])
        if pd.notna(row[20]):
            feature_ids = []
            namestr = str(row[20])
            if namestr is not None:
                names = namestr.split(",")
                for name in names:
                    ids = get_predefined_by_type_and_name(FEATURE_ENTITY_TYPE, name)
                    if ids is not None:
                        feature_ids.append(ids.predefined_id)
            product["feature_ids"] = feature_ids

        product_type = get_predefined_by_type_and_name(PRODUCT_TYPE_ENTITY, "TYRE")
        if product_type is not None:
            product["product_type_id"] = product_type.predefined_id
        try:
            create_product(product, None, None)
        except Exception as e:
            continue


def import_battery_excel(file):
    df = check_file_type_import(file)
    for index, row in df.iterrows():
        product = {}

        if pd.notna(row[0]):
            product["product_name"] = str(row[0])

        if pd.notna(row[1]):
            category = get_predefined_by_type_and_name(
                CATEGORY_ENTITY_TYPE, str(row[1])
            )
            if category is not None:
                product["category_id"] = category.predefined_id

        if pd.notna(row[2]):
            brand = get_predefined_by_type_and_name(BRAND_ENTITY_TYPE, str(row[2]))
            if brand is not None:
                product["brand_id"] = brand.predefined_id

        if pd.notna(row[3]):
            name = get_predefined_by_type_and_name(TYER_TYPE_ENTITY_TYPE, str(row[3]))
            if name is not None:
                product["tyer_type_id"] = name.predefined_id

        if pd.notna(row[4]):
            name = get_predefined_by_type_and_name(WIDTH_ENTITY_TYPE, str(row[4]))
            if name is not None:
                product["width_id"] = name.predefined_id

        if pd.notna(row[5]):
            name = get_predefined_by_type_and_name(ASPECT_ENTITY_TYPE, str(row[5]))
            if name is not None:
                product["aspect_ratio_id"] = name.predefined_id

        if pd.notna(row[6]):
            name = get_predefined_by_type_and_name(RIM_ENTITY_TYPE, str(row[6]))
            if name is not None:
                product["rim_id"] = name.predefined_id

        if pd.notna(row[7]):
            name = get_predefined_by_type_and_name(
                TYRE_CONSTRUCTION_ENTITY_TYPE, str(row[7])
            )
            if name is not None:
                product["tyre_construction_id"] = name.predefined_id

        if pd.notna(row[8]):
            product["warranty"] = str(row[8])

        if pd.notna(row[9]):
            product["purchase_price"] = str(row[9])

        if pd.notna(row[10]):
            product["product_price"] = str(row[10])

        if pd.notna(row[11]):
            product["product_offer_price"] = str(row[11])

        if pd.notna(row[12]):
            product["slug"] = str(row[12])

        if pd.notna(row[13]):
            product["description"] = str(row[13])

        if pd.notna(row[14]):
            product["key_feature"] = str(row[14])

        if pd.notna(row[15]):
            product["compatible_vehicles"] = str(row[15])

        if pd.notna(row[16]):
            name = get_predefined_by_type_and_name(GST_ENTITY_TYPE, str(row[16]))
            if name is not None:
                product["gst_id"] = name.predefined_id

        if pd.notna(row[17]):
            name = get_predefined_by_type_and_name(
                TYRE_POSTION_ENTITY_TYPE, str(row[17])
            )
            if name is not None:
                product["tyer_ps_id"] = name.predefined_id

        if pd.notna(row[18]):
            product["ply_rating"] = str(row[18])
        if pd.notna(row[19]):
            product["hsn_code"] = str(row[19])
        if pd.notna(row[20]):
            feature_ids = []
            namestr = str(row[20])
            if namestr is not None:
                names = namestr.split(",")
                for name in names:
                    ids = get_predefined_by_type_and_name(FEATURE_ENTITY_TYPE, name)
                    if ids is not None:
                        feature_ids.append(ids.predefined_id)
            product["feature_ids"] = feature_ids

        product_type = get_predefined_by_type_and_name(PRODUCT_TYPE_ENTITY, "BATTERY")
        if product_type is not None:
            product["product_type_id"] = product_type.predefined_id
        try:
            create_product(product, None, None)
        except:
            continue
