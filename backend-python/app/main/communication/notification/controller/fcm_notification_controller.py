from flask import request
from flask_restx import Resource
import json
from ..service.fcm_notification_service import (
    send_fcm_notification_async,
    send_fcm_notification,
    notification_list,
    send_fcm_topic_notification_async,
    notification_read,
    notification_count,
)
from ..dto.fcm_notification_dto import FirebaseNotificationDto
from ....user.service.user_service import get_user_by_username
from flask_jwt_extended import jwt_required, get_jwt_identity
import asyncio

api = FirebaseNotificationDto.api
firebase_notification_dto = FirebaseNotificationDto.firebase_notification
_firebase_list_req = FirebaseNotificationDto.firebase_list_req
_firebase_list_res = FirebaseNotificationDto.firebase_list_res


@api.route("/send")
class SendNotification(Resource):
    @api.doc("/send_notification", body=firebase_notification_dto)
    @api.expect(firebase_notification_dto, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        data = request.json
        # asyncio.run(send_fcm_notification_async(data))
        send_fcm_notification(data)
        return {"message": "Notification Send Successfully"}


@api.route("/send-topic")
class SendNotification(Resource):
    @api.doc("/send_topic_notification", body=firebase_notification_dto)
    @api.expect(firebase_notification_dto, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        data = request.json
        asyncio.run(send_fcm_topic_notification_async(data))
        # send_fcm_notification(data)
        return {"message": "Notification Send Successfully"}


@api.route("/list")
class ListNotification(Resource):
    @api.doc("/list_notification", body=_firebase_list_req)
    @api.expect(_firebase_list_req, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        data = request.json
        notification = notification_list(data)
        # send_fcm_notification(data)
        return api.marshal(notification, _firebase_list_res)


@api.route("/count")
class ListNotification(Resource):
    @api.doc("/list_notification_count", body=_firebase_list_req)
    @api.expect(_firebase_list_req, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        data = request.json
        notification = notification_count(data)
        # send_fcm_notification(data)
        return notification, 200


@api.route("/read-notification")
class ReadNotification(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        current_user = get_jwt_identity()
        user = get_user_by_username(username=current_user)
        notification = notification_read(user)
        # send_fcm_notification(data)
        return {"message": "Update successfully"}
