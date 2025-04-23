from flask import request
from flask_restx import Resource
import json
from ..service.email_service import send_email_async, send_email
from ..dto.email_dto import EmailDto
from ....user.service.user_service import get_user_by_username
from flask_jwt_extended import jwt_required, get_jwt_identity
import asyncio
from ..model.mail import Mail

api = EmailDto.api
email_dto = EmailDto.email_dto


@api.route("/send")
class SendEmail(Resource):
    @api.doc("/send_email", body=email_dto)
    @api.expect(email_dto, validate=False)
    # @jwt_required()
    def post(self):
        # current_user = get_jwt_identity()
        # user = get_user_by_username(username=current_user)
        """Save firebase token"""
        data = request.json
        mail = Mail(**data)
        # asyncio.run(send_email_async(mail))
        send_email(mail)
        return {"message": "Email Send Successfully"}, 200
