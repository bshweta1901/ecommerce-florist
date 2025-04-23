from flask_restx import Namespace, fields


class AuthRequest:
    api = Namespace('auth', description='Authentication related operations')

    auth_request = api.model('auth', {
        'refresh_token': fields.String(required=True, description='Refresh token pass here')
    })
