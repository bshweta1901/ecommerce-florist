from flask_restx import Namespace, fields


class CommonModelDto:
    common_model_api = Namespace("Common Model", description="Common Model Dtos")

    is_del_and_deact = common_model_api.model(
        "isDeleteAndIsDeactivate",
        {"is_delete": fields.Boolean(), "is_active": fields.Boolean()},
    )

    # ----------------COMMON DTO--------------------------
    common_req = common_model_api.model(
        "CommonReq",
        {
            "search_by": fields.String(),
            "is_active": fields.Boolean(default=False),
            "page_number": fields.Integer(),
            "page_size": fields.Integer(),
        },
    )
    error_response_dto = common_model_api.model(
        "ErrorResponseDTO", {"message": fields.String()}
    )
    create_response_dto = common_model_api.model(
        "CreateResponse", {"message": fields.String(), "id": fields.Integer()}
    )

    list_payload_dto = common_model_api.model(
        "ListPayloadDTO",
        {
            "search_by": fields.String(),
            "is_active": fields.Boolean(),
            "page": fields.Integer(default=1),
            "per_page": fields.Integer(default=10),
        },
    )

    data_list = common_model_api.model(
        "ListData",
        {
            "total": fields.Integer(
                required=False, description="Total number of  data"
            ),
            "page": fields.Integer(required=False, description="Current page number"),
            "page_size": fields.Integer(
                required=False, description="Number of records per page"
            ),
            "total_pages": fields.Integer(
                required=False, description="Total number of available pages"
            ),
        },
    )

    common_model_dto = common_model_api.model(
        "common_model_dto",
        {
            "id": fields.Integer(),
            "status": fields.String(),
            "is_delete": fields.Boolean(),
            "is_active": fields.Boolean(),
            "created_at": fields.DateTime(),
            "modified_at": fields.DateTime(),
            "created_by": fields.Integer(),
            "modified_by": fields.Integer(),
        },
    )

    count = common_model_api.model(
        "Count",
        {"count": fields.Integer(default=0)},
    )
    save_update_res = common_model_api.model(
        "saveUpdateRes",
        {"message": fields.String(default="Save Success"), "id": fields.Integer()},
    )

    message = common_model_api.model(
        "Message",
        {"message": fields.String(description="Response message")},
    )

    uuid = common_model_api.model(
        "CommonUuid",
        {"uuid": fields.String()},
    )
