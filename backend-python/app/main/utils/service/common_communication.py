import threading
from ...communication.email.model.mail import Mail
from ...communication.email.service.email_service import send_email_async
import asyncio
from ...communication.notification.service.fcm_notification_service import (
    send_fcm_notification_async,
)
from ...communication.notification.model.firebase_token_master import (
    FirebaseTokenMaster,
)
from app.extensions import db
from flask import current_app


def send_func_in_bg(func,  **kwargs):
    def run_in_context(app_context):
        with app_context:
            func(**kwargs)

    app_context = current_app.app_context()
    thread = threading.Thread(target=run_in_context, args=(app_context,))
    thread.start()


async def send_mail(
    recipient, template_code=None, model=None, attachment=None, bcc=None, cc=None
):
    if None in recipient:
        recipient = list(filter(lambda x: x is not None, recipient))
    if len(recipient) > 0:
        mail = Mail(
            to=recipient,
            template_code=template_code,
            model=model,
            file_attachments=attachment,
            bcc=bcc,
            cc=cc,
        )

        asyncio.run(send_email_async(mail))


async def send_notification(
    user_id, service_point_id=None, template_code=None, model=None, entity_type=None
):
    token = (
        db.session.query(FirebaseTokenMaster.firebase_token)
        .filter(FirebaseTokenMaster.user_id.in_(user_id))
        .all()
    )
    tokens = [tup[0] for tup in token]

    if token is not None and len(token) > 0:
        data = {}
        data["to"] = tokens
        data["template_code"] = template_code
        data["model"] = model
        data["user_id"] = user_id
        data["service_point_id"] = service_point_id
        data["message"] = None
        data["entity_type"] = entity_type
        asyncio.run(send_fcm_notification_async(data))
    # send_fcm_notification(data)


async def send_sms(phone, model):
    if phone is not None:
        unicode = current_app.config["SMS_UNICODE"]
        sms_from = current_app.config["SMS_FROM"]
        dlt_content_id = current_app.config["SMS_DLT_CONTENT_ID"]
        username = current_app.config["SMS_USERNAME"]
        password = current_app.config["SMS_PASSWORD"]
        unicode = current_app.config["SMS_UNICODE"]
        text = current_app.config["SMS_TEXT"]

        formatted_sms_text = text.format(otp=model.get("otp", None))
        # Constructing the API URL
        url = current_app.config["SMS_API_URL"]

        # Constructing the request parameters
        params = {
            "username": username,
            "password": password,
            "unicode": unicode,
            "from": sms_from,
            "to": phone,
            "dltContentId": dlt_content_id,
            "text": formatted_sms_text,
        }
        # Disable SSL verification (Not recommended for production)
        threading.Thread(target=sms_url_api_call,
                         args=(url, params, False)).start()
        response = None

        return response


def sms_url_api_call(url, params, verify_flag):
    requests.get(url, params=params, verify=verify_flag)
