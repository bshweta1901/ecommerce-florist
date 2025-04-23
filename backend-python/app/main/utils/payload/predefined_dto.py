from flask_restx import Namespace, fields

from app.main.utils.payload.common_model_dto import CommonModelDto


class PredefinedDto:
    api = Namespace(
        "Predefined Master",
        description="Predefined Master API's (This holds all the dropdown values, Constants, etc..)",
    )
    parent_data = api.model(
        "PredefinedParentResponse",
        {
            "uuid": fields.String(required=False, description="Id of the product"),
            "id": fields.Integer(required=False, description="Id of the product"),
            "name": fields.String(required=False, description="Product name"),
            "code": fields.String(required=False, description="Product price"),
            "entity_type": fields.String(required=False, description="Entity type"),
            "field1": fields.String(required=False),
            "field2": fields.String(required=False),
            "field3": fields.String(required=False),
            "is_delete": fields.Boolean(),
            "is_active": fields.Boolean(),
            "url": fields.String(required=False),
            "thumbnail": fields.String(required=False),
        },
    )
    predefined_res = api.model(
        "PredefinedResponse",
        {
            "uuid": fields.String(required=False, description="Id of the product"),
            "id": fields.Integer(required=False, description="Id of the product"),
            "name": fields.String(required=False, description="Product name"),
            "code": fields.String(required=False, description="Product price"),
            "entity_type": fields.String(required=False, description="Entity type"),
            "field1": fields.String(required=False),
            "field2": fields.String(required=False),
            "field3": fields.String(required=False),
            "is_delete": fields.Boolean(),
            "is_active": fields.Boolean(),
            "url": fields.String(required=False),
            "thumbnail": fields.String(required=False),
            "parent": fields.Nested(parent_data, skip_none=True),
        },
    )

    predefined_data = api.model(
        "PredefinedDataRequest",
        {
            "uuid": fields.String(required=False, description="Id of the product"),
            "id": fields.Integer(required=False, description="Id of the product"),
            "name": fields.String(required=False, description="Product name"),
            "code": fields.String(required=False, description="Product price"),
            "entity_type": fields.String(
                required=False,
                description="Entity type (it must be unique for a group)",
            ),
            "field1": fields.String(
                required=False,
            ),
            "field2": fields.String(
                required=False,
            ),
            "field3": fields.String(
                required=False,
            ),
            "is_delete": fields.Boolean(),
            "is_active": fields.Boolean(),
            "url": fields.String(required=False),
            "thumbnail": fields.String(required=False),
            "parent_id": fields.Integer(),
            "parent": fields.Nested(parent_data, skip_none=True),
        },
    )
    request_payload = api.model(
        "PredefinedRequest",
        {
            "parent_id": fields.Integer(),
            "entity_type": fields.String(),
            "code": fields.String(),
            "sub_entity": fields.String(),
            "is_sort": fields.Boolean(),
            **CommonModelDto.common_req,
        },
    )
    predefined_short_res = api.model(
        "Predefined",
        {
            "uuid": fields.String(
                description="uuid of the product",
            ),
            "id": fields.Integer(required=False, description="Id of the product"),
            "name": fields.String(
                required=False,
                description="Product name",
            ),
            "code": fields.String(
                required=False,
                description="Product price",
            ),
            "entity_type": fields.String(
                required=False,
                description="Entity type (it must be unique for a group)",
            ),
        },
    )

    data_list = api.model(
        "PredeinedListData",
        {
            "data": fields.List(
                fields.Nested(predefined_res), description="List of predefined data"
            ),
            **CommonModelDto.data_list,
        },
    )
