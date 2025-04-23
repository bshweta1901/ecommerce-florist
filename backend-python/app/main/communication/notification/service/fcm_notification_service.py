import asyncio
import json
import urllib.request

from app.main.exceptation.custom_exception import CustomException
from ..model.communication_logs import CommunicationLogs
from ..model.fcm_notification_config import NotificationConfig
from ...template.model.template_master import TemplateMaster
from flask_restx import abort
from firebase_admin import messaging
from firebase_admin import credentials
import firebase_admin  # Add this import statement
from .....extensions import db
from flask import Flask, request, current_app
import os


async def send_fcm_notification_async(fcm_notification):
    try:
        return await asyncio.to_thread(send_fcm_notification, fcm_notification)
    except Exception as e:
        raise CustomException(str(e), 500)


async def send_fcm_topic_notification_async(fcm_notification):
    return await asyncio.to_thread(send_fcm_topic_notification, fcm_notification)


def send_fcm_notification(fcm_notification):
    if (
        fcm_notification.get("to") is None or len(
            fcm_notification.get("to")) == 0
    ) and fcm_notification.get("topic") is None:
        abort(400, error="FCM Token Should not be Blank")
    if (
        fcm_notification.get("template_code") is None
        and fcm_notification.get("message") is None
    ):
        abort(400, error="Content Missing")
    if (
        fcm_notification.get("entity_type") is None
        and fcm_notification.get("entity_type") is None
    ):
        abort(400, error="Entity Type is  Missing")

    communication_logs = CommunicationLogs()
    notification_config = NotificationConfig.query.filter(
        NotificationConfig.is_delete == "N",
        NotificationConfig.entity_type == fcm_notification.get("entity_type"),
    ).first()
    current_app.logger.info(
        "Checking if appointment document is None and document_id exists"
    )
    if notification_config is None:
        abort(400, error="From FCM Server Key not found")

    message = ""
    if (
        fcm_notification.get("template_code") is not None
        and fcm_notification.get("template_code") != ""
    ):
        template_master = TemplateMaster.query.filter(
            TemplateMaster.template_code == fcm_notification.get(
                "template_code"),
            TemplateMaster.is_delete == "N",
        ).first()

        if template_master is None:
            abort(
                400,
                error="Template not found for code : "
                + fcm_notification.get("template_code"),
            )

        communication_logs.notification_read = False
        communication_logs.type = "NOTIFICATION"
        communication_logs.to_user_id = str(fcm_notification.get("user_id"))
        communication_logs.entity_type = template_master.entity_type

        if fcm_notification.get("model") is not None:
            template_message = replace_keywords(
                template_master.template_data, fcm_notification.get("model")
            )
        else:
            template_message = template_master.template_data

        communication_logs.title = template_master.template_title
        communication_logs.message = template_message
        fcm_notification["image_url"] = template_master.fcm_image_url
        fcm_notification["title"] = template_master.template_title
    else:
        communication_logs.notification_read = False
        communication_logs.type = "NOTIFICATION"
        if fcm_notification.get("user_id") is not None:
            communication_logs.to_user_id = str(
                fcm_notification.get("user_id"))
        communication_logs.entity_type = fcm_notification.get("entity_type")
        communication_logs.title = fcm_notification.get("title")

        if fcm_notification.get("model") is not None:
            template_message = replace_keywords(
                fcm_notification.get("message"), fcm_notification.get("model")
            )
        else:
            template_message = fcm_notification.get("message")
        communication_logs.message = template_message

    file_path = notification_config.file_path
    current_app.logger.info(
        "Checking if appointment document is None and document_id exists"
    )
    if os.path.exists(file_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(file_path)
            firebase_admin.initialize_app(cred)
        current_app.logger.info(
            "Checking if appointment document is None and document_id exists"
        )
    else:
        abort(400, "Service File not Exist")
    registration_tokens = fcm_notification.get("to")
    if fcm_notification.get("service_point_id") is not None:
        communication_logs.service_point_id = fcm_notification.get(
            "service_point_id")
    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=communication_logs.title, body=template_message
        ),
        tokens=registration_tokens,
    )
    try:
        response = messaging.send_multicast(message)
        print("{0} messages were sent successfully".format(
            response.success_count))
        communication_logs.status = "SUCCESS"
        if response.failure_count > 0:
            communication_logs.status = "FAILURE"
            responses = response.responses
            failed_tokens = []
            for idx, resp in enumerate(responses):
                if not resp.success:
                    failed_tokens.append(registration_tokens[idx])
            communication_logs.status = "FAILURE"
            print("List of tokens that caused failures: {0}".format(
                failed_tokens))

        db.session.add(communication_logs)
        db.session.commit()
    except Exception as e:
        communication_logs.status = "FAILURE"
        print("An error occurred:", e)


def replace_keywords(html, models):
    for key, value in models.items():
        html = html.replace("{{" + key + "}}", str(value))
    return html


def notification_list(data):
    query = CommunicationLogs.query.filter(CommunicationLogs.is_delete == "N")
    query = query_criteria(query, data)
    page = int(data["page_number"]) if "page_number" in data else None
    per_page = int(data["page_size"]) if "page_size" in data else None
    query = query.order_by(CommunicationLogs.log_id.desc())
    if page is not None and per_page is not None:
        firebase_token = query.paginate(page=page, per_page=per_page).items
    else:
        firebase_token = query.all()

    return firebase_token


def notification_count(data):
    query = CommunicationLogs.query.filter(CommunicationLogs.is_delete == "N")
    query = query_criteria(query, data)
    current_app.logger.info(
        "SQL Query:::::: +++++++++++++++++++++++++++++++++ {}".format(query)
    )
    firebase_token = query.count()

    return {"total_count": firebase_token}


def query_criteria(query, data):
    type = data.get("type", None)
    user_id = data.get("id", None)
    service_point_id = data.get("service_point_id", None)
    notification_read = data.get("notification_read", None)
    if notification_read is not None:
        query = query.filter(
            CommunicationLogs.notification_read == notification_read)

    if user_id is not None and service_point_id is None:
        query = query.filter(CommunicationLogs.to_user_id == user_id)
    if service_point_id is not None:
        query = query.filter(
            CommunicationLogs.service_point_id == service_point_id)
    if type:
        query = query.filter(CommunicationLogs.type == type)

    return query


def send_fcm_topic_notification(fcm_notification):
    if (
        fcm_notification.get("to") is None or len(
            fcm_notification.get("to")) == 0
    ) and fcm_notification.get("topic") is None:
        abort(400, error="FCM Token Should not be Blank")
    if (
        fcm_notification.get("template_code") is None
        and fcm_notification.get("message") is None
    ):
        abort(400, error="Content Missing")

    communication_logs = CommunicationLogs()
    notification_config = NotificationConfig.query.filter(
        NotificationConfig.is_delete == "N"
    ).first()
    if notification_config is None:
        abort(400, error="From FCM Server Key not found")

    message = ""
    if (
        fcm_notification.get("template_code") is not None
        and fcm_notification.get("template_code") != ""
    ):
        template_master = TemplateMaster.query.filter(
            TemplateMaster.template_code == fcm_notification.get(
                "template_code"),
            TemplateMaster.is_delete == "N",
        ).first()

        if template_master is None:
            abort(
                400,
                error="Template not found for code : "
                + fcm_notification.get("template_code"),
            )

        communication_logs.notification_read = False
        communication_logs.type = "NOTIFICATION"
        communication_logs.to_user_id = str(fcm_notification.get("topic"))
        communication_logs.entity_type = template_master.entity_type
        if fcm_notification.get("model") is not None:
            template_message = replace_keywords(
                template_master.template_data, fcm_notification.get("model")
            )
        else:
            template_message = template_master.template_data

        communication_logs.title = template_master.template_title
        communication_logs.message = template_message
        fcm_notification["image_url"] = template_master.fcm_image_url
        fcm_notification["title"] = template_master.template_title
    else:
        communication_logs.notification_read = False
        communication_logs.type = "NOTIFICATION"
        if fcm_notification.get("topic") is not None:
            communication_logs.to_user_id = str(fcm_notification.get("topic"))
        communication_logs.entity_type = fcm_notification.get("entity_type")
        communication_logs.title = fcm_notification.get("title")
        if fcm_notification.get("model") is not None:
            template_message = replace_keywords(
                fcm_notification.get("message"), fcm_notification.get("model")
            )
        else:
            template_message = fcm_notification.get("message")

        communication_logs.message = template_message

    file_path = notification_config.file_path
    if not firebase_admin._apps:
        cred = credentials.Certificate(file_path)
        firebase_admin.initialize_app(cred)
    registration_tokens = fcm_notification.get("topic")

    message = messaging.Message(
        notification=messaging.Notification(
            title=communication_logs.title, body=template_message
        ),
        topic=fcm_notification.get("topic"),
    )
    try:
        response = messaging.send(message)
        print("{0} messages were sent successfully".format(
            response.success_count))
        if response.failure_count > 0:
            communication_logs.status = "FAILURE"
            responses = response.responses
            failed_tokens = []
            for idx, resp in enumerate(responses):
                if not resp.success:
                    failed_tokens.append(registration_tokens[idx])
            print("List of tokens that caused failures: {0}".format(
                failed_tokens))
        communication_logs.status = "SUCCESS"
        db.session.add(communication_logs)
        db.session.commit()
    except Exception as e:
        communication_logs.status = "FAILURE"


def notification_read(user):
    service_point_id = request.args.get("service_point_id")
    if service_point_id is not None:
        query = CommunicationLogs.query.filter(
            CommunicationLogs.service_point_id == service_point_id
        )
        print(query)  # Debug: Print the generated SQL query
        query.update({"notification_read": True})
        db.session.commit()
        return None
    id = "[" + str(user.id) + "]"
    query = CommunicationLogs.query.filter(CommunicationLogs.to_user_id == id)
    print(query)  # Debug: Print the generated SQL query
    query.update({"notification_read": True})
    db.session.commit()
    id = str(user.id)
    query = CommunicationLogs.query.filter(CommunicationLogs.to_user_id == id)
    print(query)  # Debug: Print the generated SQL query
    query.update({"notification_read": True})
    db.session.commit()
