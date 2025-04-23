from flask_restx import abort

from app.main.exceptation.custom_exception import CustomException
from ...template.model.template_master import TemplateMaster
from flask_mail import Mail
from flask import current_app
from ...notification.model.communication_logs import CommunicationLogs
from flask import Flask, jsonify, render_template
from flask_mail import Message
import os
from .....extensions import db
import asyncio


async def send_email_async(mail):
    return await asyncio.to_thread(send_email, mail)


def send_email(mail):
    try:
        # Assuming you have a method to fetch SMTP configuration

        if mail.template_code is None and mail.content is None:
            abort(400, error="Content Missing")

        if len(mail.to) == 0:
            abort(400, error="At least 1 Recipient Required")

        email = Mail(current_app)
        mail.from_address = current_app.config["MAIL_USERNAME"]

        communication_logs = CommunicationLogs()
        html = ""
        if mail.template_code is not None and mail.template_code != "":
            # Assuming you have methods for database operations and template rendering
            template_master = TemplateMaster.query.filter(
                TemplateMaster.template_code == mail.template_code,
                TemplateMaster.is_delete == "N",
            ).first()
            current_app.logger.info(f"Saving document master 1{{}}", mail)
            if template_master is None:
                abort(
                    400,
                    error="Template not found for code : " + mail.template_code,
                )
            template = replace_keywords(
                template_master.template_title, mail.model)
            current_app.logger.info("Saving document master***** 2")
            mail.subject = template
            current_app.logger.info("Saving document master***** 3")

            communication_logs.to_user_id = (str(mail.to),)
            communication_logs.parent_user_id = (mail.from_address,)
            communication_logs.entity_type = (template_master.entity_type,)
            communication_logs.title = (template,)
            current_app.logger.info("Saving document master***** 4")

            if (
                template_master.template_resource_name is not None
                and template_master.template_resource_name != ""
            ):
                current_app.logger.info("Saving document master***** 5")

                context = {}
                context.update(mail.model)
                html = render_template(
                    template_master.template_resource_name, data=context
                )
                current_app.logger.info("Saving document master***** 6", mail)

            else:
                html = replace_keywords(
                    template_master.template_data, mail.model)
        else:
            html = replace_keywords(mail.content, mail.model)
            communication_logs.to_user_id = (str(mail.to),)
            communication_logs.parent_user_id = (mail.from_address,)
            communication_logs.title = mail.subject
        current_app.logger.info("Saving document master***** 7")

        msg = Message(subject=mail.subject, recipients=mail.to, html=html)
        current_app.logger.info(
            "Saving document master***** 8", msg, "subject")
        if len(mail.cc) > 0:
            msg.cc = mail.cc
        current_app.logger.info("Saving document master***** 8", msg, "cc")
        if len(mail.bcc) > 0:
            msg.bcc = mail.bcc
        current_app.logger.info("Saving document master***** 8", msg, "bcc")
        current_app.logger.info(
            "Saving document master*****:- 9 ", mail.file_attachments
        )
        if len(mail.file_attachments) > 0:

            current_app.logger.info(
                "Saving document master*****:-", mail.file_attachments
            )
            for file in mail.file_attachments:
                current_app.logger.info(
                    "Saving document master*****:- 10 ", file)
                attachment_name = os.path.basename(file)
                with current_app.open_resource(file) as f:
                    msg.attach(attachment_name,
                               "application/octet-stream", f.read())
        current_app.logger.info("Saving document master*****:- 11")
        email.send(msg)
        communication_logs.type = "EMAIL"
        communication_logs.status = "IN_PROGRESS"
        db.session.add(communication_logs)
        db.session.commit()
        return "Email sent successfully"
    except Exception as e:
        raise CustomException(str(e), 500)


# Define your routes here
def replace_keywords(html, models):
    for key, value in models.items():
        html = html.replace("{{" + key + "}}", str(value))
    return html
