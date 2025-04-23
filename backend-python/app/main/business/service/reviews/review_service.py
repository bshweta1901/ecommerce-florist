from .models.review_model import ReviewsMaster
from .....extensions import db
from flask import request


def create_review(data, user):

    review = ReviewsMaster(
        rating=data.get("rating"),
        product_id=data.get("product_id"),
        user_id=data.get("user_id"),
        comments=data.get("comments"),
        created_by=user.id,
    )
    db.session.add(review)
    db.session.commit()
    return review


def get_review_by_id(review_id):

    return ReviewsMaster.query.get(review_id)


def get_all_reviews(data):
    try:
        query = ReviewsMaster.query.filter(ReviewsMaster.is_delete == "N")
        query = query_criteria(data, query)
        page = data.get("page_number", None)
        per_page = data.get("page_size", None)
        query = query.order_by(ReviewsMaster.rating.desc())

        average_rating = None
        if page is not None and per_page is not None:
            query = query.limit(per_page)  # Apply LIMIT based on per_page
            if page >= 1:
                offset = (page - 1) * per_page
                query = query.offset(offset)  # Apply OFFSET based on page_number

        reviews = query.all()

        return reviews
    except Exception as e:
        pass


def get_review_average_by_product(product_id):
    """Calculates the average rating and optionally the total review count for a product.

    Args:
        product_id (int): The ID of the product.
        include_count (bool, optional): Whether to include the total review count. Defaults to False.

    Returns:
        tuple: A tuple containing:
            - float: The average rating (or None if no reviews found).
            - int: The total review count (optional, only if `include_count` is True).
    """
    average_rating = None

    query = ReviewsMaster.query.filter_by(product_id=product_id).filter(
        ReviewsMaster.rating.is_not(None)
    )

    # if not query.count():
    #     return None, 0 if include_count else None

    total_rating = query.with_entities(db.func.sum(ReviewsMaster.rating)).scalar()
    if total_rating is not None:
        average_rating = total_rating / query.count()

    return average_rating


def query_criteria(data, query):
    product_id = data.get("product_id", None)
    user_id = data.get("user_id", None)
    rating = data.get("rating", None)
    if product_id:
        query = query.filter(ReviewsMaster.product_id == product_id)
    if user_id:
        query = query.filter(ReviewsMaster.user_id == user_id)
    if rating:
        query = query.filter(ReviewsMaster.rating == rating)
    return query


def get_count_reviews(data):
    query = ReviewsMaster.query.filter(ReviewsMaster.is_delete == "N")
    query = query_criteria(data, query)

    count = query.count()
    product_id = data.get("product_id", None)
    if product_id:
        average_rating = get_review_average_by_product(product_id)
    return {"count": count, "average_rating": average_rating}
