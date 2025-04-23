from app.main.exceptation.custom_exception import CustomException
from ..model.firebase_token_master import FirebaseTokenMaster
from .....extensions import db
from datetime import datetime
from flask_restx import abort


def create_firebase_token(data):
    try:
        firebase_token = FirebaseTokenMaster.query.filter(
            FirebaseTokenMaster.firebase_token == data.get("firebase_token"),
            FirebaseTokenMaster.user_id == data.get("user_id"),
        ).first()
        if firebase_token is not None:
            return {
                "message": "Firebase Token created successfully",
            }
        firebase_token = FirebaseTokenMaster(**data)
        db.session.add(firebase_token)
        db.session.commit()
        return {
            "message": "Firebase created successfully",
        }
    except Exception as e:
        db.session.rollback()
        raise CustomException(str(e), 500)


def get_all_firebase_token(data):
    query = FirebaseTokenMaster.query.filter_by(is_delete="N")
    query = query_criteria(query, data)
    page = int(data["page_number"]) if "page_number" in data else None
    per_page = int(data["page_size"]) if "page_size" in data else None
    if page is not None and per_page is not None:
        firebase_token = query.paginate(page=page, per_page=per_page).items
    else:
        firebase_token = query.all()

    return firebase_token


def query_criteria(query, data):

    firebase_token = data.get("firebase_token", None)
    user_id = data.get("id", None)
    if firebase_token:
        query = query.filter(
            FirebaseTokenMaster.firebase_token == firebase_token)
    if user_id:
        query = query.filter(FirebaseTokenMaster.user_id == user_id)
    return query


def get_firebase_token_count(data):
    query = FirebaseTokenMaster.query.filter_by(is_delete="N")
    query = query_criteria(query, data)
    count = query.count()
    return {"total_count": count}
