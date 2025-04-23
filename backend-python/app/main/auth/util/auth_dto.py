from flask_restx import Namespace, fields


class AuthDto:
    api = Namespace('auth', description='Authentication related operations')
    # _user = UserDto.user
    user = api.model('auth', {
        'username': fields.String(description='user username'),
        'email': fields.String(description='user email'),
        'login_panel': fields.String(required=True, description='trying to login from which platform, eg WEB,ADMIN,APP,POSAPP,etc..'),
        'password': fields.String(required=False, description='user password'),
        'otp': fields.String(required=False, description='user otp')
    })

    auth_request = api.model('auth_request', {
        'refresh_token': fields.String(required=True, description='Refresh token pass here')
    })

    auth_res_data_dto = api.model(
        'auth_res_data_dto', {
            "access_token": fields.String(),
            "refresh_token": fields.String(),

            # "user": fields.Nested(_user)
        }
    )
    auth_response_dto = api.model(
        'auth_response', {
            'message': fields.String(),
            "is_new_user": fields.Boolean(),
            'data': fields.Nested(auth_res_data_dto)
        }
    )

    tokens_dto = api.model(
        'tokens_dto', {
            "access_token": fields.String(),
            "refresh_token": fields.String(),
            "user_uuid": fields.String(),
            "message": fields.String()
        }
    )
