from flask_restx import Namespace, fields

from .user_dto import UserDto


class AccessControlDto:
    api = Namespace("AccessControl",
                    description="Access Control related operations")
    access_control_response = api.model(
        "access_control_response",
        {
            "access_control_id": fields.Integer(description="ID of the access control"),
            "role_module_id": fields.Integer(description="ID of the role module"),
            "create_access": fields.Boolean(description="Create access"),
            "read_access": fields.Boolean(description="Read access"),
            "update_access": fields.Boolean(description="Update access"),
            "delete_access": fields.Boolean(description="Delete access"),
            "user_id": fields.Integer(description="ID of the user"),
            # "static_ip_address": fields.String(description="Static IP Address"),
            "module_code": fields.String(description="Module Code"),
            "role_module": fields.Nested(
                api.model(
                    "role_module_response",
                    {
                        "id": fields.Integer(description="ID of the role module"),
                        "role_id": fields.Integer(description="ID of the role module"),
                        "module_id": fields.Integer(
                            description="ID of the role module"
                        ),
                        "role": fields.Nested(
                            UserDto.role, description="ID of the role module"
                        ),
                        "module": fields.Nested(
                            api.model(
                                "module_response",
                                {
                                    "module_id": fields.Integer(
                                        description="ID of the role module"
                                    ),
                                    "module_name": fields.String(
                                        description="ID of the role module"
                                    ),
                                    "module_code": fields.String(
                                        description="ID of the role module"
                                    ),
                                    "module_url": fields.String(
                                        description="ID of the role module"
                                    ),
                                },
                                description="ID of the role module",
                            ),
                        ),
                    },
                )
            ),
            "user": fields.Nested(
                api.model(
                    "user_response",
                    {
                        "user_id": fields.Integer(description="ID of the user"),
                        # Add other fields related to user if needed
                    },
                )
            ),
        },
    )
