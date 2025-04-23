from flask_restx import Namespace, fields


class AuthResponse:
    api = Namespace('auth', description='Authentication related operations')
    auth = api.model('auth', {
        'refresh_token': fields.String(required=True, description='Refresh token pass here')
    })
