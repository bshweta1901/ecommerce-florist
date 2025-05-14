from flask_restx import Namespace, fields

from app.main.business.util.product.product_dto import ProductDto
from app.main.user.util.user_dto import UserDto
from ....utils.payload.predefined_dto import PredefinedDto

# from ...service_point.util.service_point_dto import ServicePointDto

from flask_restx import reqparse
from werkzeug.datastructures import FileStorage


class OrderDto:
    order_api = Namespace("order", description="Order related operations")
    _predefined = PredefinedDto.predefined_res

    _product_dto = ProductDto.product_res
    _user_dto = UserDto.user

    _service_point = order_api.model(
        "service_point",
        {
            "service_point_name": fields.String(
                required=False, description="Name of the service point"
            ),
            "lat": fields.String(
                required=False, description="Latitude of the service point"
            ),
            "lng": fields.String(
                required=False, description="Longitude of the service point"
            ),
            "city_id": fields.Integer(attribute="cityId", description="ID of the city"),
            "full_name": fields.String(required=True, description="user full name"),
            "username": fields.String(required=True, description="username"),
            "service_point_address": fields.String(
                required=False, description="username"
            ),
            "email": fields.String(required=False, description="email"),
            "phone": fields.String(required=False, description="Phone"),
            "dob": fields.DateTime(description="Date of Birthday"),
            "date_of_joining": fields.DateTime(description="Date of Joining"),
            "designation_id": fields.Integer(description="Degisnation"),
            "gender_id": fields.Integer(description="Gender Id "),
            "account_type_id": fields.Integer(description="Account Type ID "),
            "address": fields.String(required=False, description="address"),
            "city_id": fields.Integer(description="City ID "),
            "service_group_id": fields.Integer(description="ID of the service_group"),
            "roles": fields.List(
                fields.String, required=False, description="user roles"
            ),
            "wallet_amount": fields.String(description="Wallet Amount"),
        },
    )
    # order = order_api.model('order', {
    #     'order_id': fields.Integer(required=False, description='Id of the order'),
    #     'city_id': fields.Integer(required=False, description='Id of the city'),
    #     'status_id':fields.Integer(required=False, description='Id of the status'),
    #     'service_point_id':fields.Integer(required=False, description='Id of the service point'),
    #     'city' : fields.Nested(_predefined, only=('predefined_id', 'name', 'code', 'entity_type')),
    #     'service_point' : fields.Nested(_predefined, only=('predefined_id', 'name', 'code', 'entity_type')),
    #     'amount' : fields.Float(required=False,attribute='double_column'),
    #     'offer_amount' : fields.Float(required=False,attribute='double_column'),
    #     'tax' : fields.Float(required=False,attribute='double_column'),
    #     'coupon_discount' : fields.String(required=False),
    #     'coupon_code' : fields.String(required=False),
    #     'payable_amount' : fields.Integer(required=False,attribute='double_column'),
    #     'service_start_date' : fields.Date(required=False),
    #     'service_start_time' : fields.Nested(_predefined),
    #     'service_end_time' : fields.DateTime(required=False),
    #     'product' : fields.Nested(_predefined),
    # })

    order_item = order_api.model(
        "order_tems",
        {
            "order_item_id": fields.Integer,
            "product_id": fields.Integer,
            "service_id": fields.Integer,
            "order_id": fields.Integer,
            "item_quantity": fields.Integer,
            "amount": fields.Float,
            "total_amount": fields.Float,
            "discount": fields.Float,
            "product": fields.Nested(_product_dto),
            "qty_balance": fields.Integer(),
            "tax": fields.Float(),
            "created_at": fields.DateTime(),
            # 'order': fields.Nested({
            #     'order_id': fields.Integer,
            #     # Add other fields from the OrderMaster model if needed
            # })
        },
    )
    order = order_api.model(
        "order",
        {
            "order_id": fields.Integer(
                required=False, description="Id of the order"
            ),  # Assuming you want a BigInteger for the ID
            "city_id": fields.Integer(required=False, description="Id of the city"),
            "payment_status_id": fields.Integer(
                required=False, description="Id of the Payment"
            ),
            "status_id": fields.Integer(required=False, description="Id of the status"),
            "service_point_id": fields.Integer(
                required=False, description="Id of the service point"
            ),
            "city": fields.Nested(PredefinedDto.predefined_res),
            "payment_status": fields.Nested(PredefinedDto.predefined_res),
            "service_point": fields.Nested(_service_point),
            "amount": fields.Float(required=False),
            "offer_amount": fields.Float(required=False),
            "created_at": fields.DateTime(required=False),
            "status": fields.Nested(_predefined),
            "approval_status": fields.Nested(_predefined),
            "service_start_time": fields.Nested(_predefined),
            "amount": fields.Float(required=False),
            "offer_amount": fields.Float(required=False),
            "tax": fields.Float(required=False),
            "payable_amount": fields.Float(required=False),
            "order_items": fields.List(
                fields.Nested(order_item), attribute="order_from_order_item"
            ),
            "user": fields.Nested(_user_dto),
            "reject_reason": fields.String(),
            "created_at": fields.DateTime(),
            "service_start_date": fields.DateTime(),
            "service_point_user": fields.Nested(_user_dto),
            "mechmiles_staff_id": fields.Integer(),
            "mechmiles_staff": fields.Nested(_user_dto),
            "assigned_status_id": fields.Integer(),
            "assigned_status": fields.Nested(_predefined),
            "total_quantity": fields.Integer(),
            "wallet_discount": fields.Integer(),
            "invoice_url": fields.String(),
            "due_date": fields.DateTime(),
            "appointment_date": fields.List(
                fields.Nested(
                    order_api.model(
                        "appoinments_date",
                        {
                            "service_start_date": fields.DateTime(),
                            "service_start_time": fields.String(),
                        },
                    )
                )
            ),
        },
    )
    order_summary_req = order_api.model(
        "order_summary_req",
        {
            "city_id": fields.Integer(required=False, description="Id of the city"),
            "service_point_id": fields.Integer(
                required=False, description="Id of the service point"
            ),
            "service_start_date": fields.Date(required=False),
            "service_start_time": fields.DateTime(required=False),
        },
    )

    order_save_req = order_api.model(
        "order_save_req",
        {
            "user_id": fields.Integer(
                required=True, description="Id of the user placing order"
            ),
            "service_point_id": fields.Integer(
                required=True, description="Id of the service point"
            ),
            "service_start_date": fields.Date(
                required=True, description="Start date of the service"
            ),
            "service_start_time_id": fields.Integer(
                required=True, description="Start time slot id of the service"
            ),
            "shipping_address_id": fields.Integer(
                required=True, description="User Address id of type SHPPING"
            ),
            "billing_address_id": fields.Integer(
                required=True, description="User Address id of type BILLING"
            ),
            "vehicle_id": fields.Integer(required=True, description="Id of Vehicle"),
            "is_use_wallet": fields.Boolean(
                required=True, description="Wallet checkbox true or false"
            ),
        },
    )
    custom_order_item_create = order_api.model(
        "order_item_create",
        {
            "product_id": fields.Integer(description="Order Item ID"),
            "service_id": fields.Integer(description="SP Quantity"),
            "item_quantity": fields.Float(description="SP Price"),
        },
    )

    custom_order_save_req = order_api.model(
        "order_save_req",
        {
            "user_id": fields.Integer(
                required=True, description="Id of the user placing order"
            ),
            "service_point_id": fields.Integer(
                required=True, description="Id of the service point"
            ),
            "service_start_date": fields.Date(
                required=True, description="Start date of the service"
            ),
            "service_start_time_id": fields.Integer(
                required=True, description="Start time slot id of the service"
            ),
            "shipping_address_id": fields.Integer(
                required=True, description="User Address id of type SHPPING"
            ),
            "billing_address_id": fields.Integer(
                required=True, description="User Address id of type BILLING"
            ),
            "vehicle_id": fields.Integer(required=True, description="Id of Vehicle"),
            "is_use_wallet": fields.Boolean(
                required=True, description="Wallet checkbox true or false"
            ),
            "order_items": fields.List(fields.Nested(custom_order_item_create)),
        },
    )

    custom_order_update_req = order_api.model(
        "custom_order_update_req",
        {
            "appointment_id": fields.Integer(
                required=True, description="Id of the user placing order"
            ),
            "service_point_id": fields.Integer(
                required=True, description="Id of the service point"
            ),
            "amount": fields.Float(
                required=True, description="Start date of the service"
            ),
        },
    )

    receipt_save_req = order_api.model(
        "receipt_save_req",
        {
            "user_id": fields.Integer(),
            "order_id": fields.Integer(),
            "status_id": fields.Integer(),
            "amount": fields.Float(),
            "description": fields.String(),
        },
    )
    receipt_res = order_api.model(
        "receipt_res",
        {
            "receipt_id": fields.Integer(),
            "user_id": fields.Integer(),
            "user": fields.Nested(_user_dto),
            "order_id": fields.Integer(),
            "order": fields.Nested(order),
            "status_id": fields.Integer(),
            "status": fields.Nested(_predefined),
            "amount": fields.Float(),
            "description": fields.String(),
        },
    )
    order_list_req = order_api.model(
        "order_list_req",
        {
            "user_id": fields.Integer(
                required=False, description="Id of the user placing order"
            ),
            "service_point_id": fields.Integer(
                required=False, description="Id of the service point"
            ),
            "search_by": fields.String(
                required=False, description="Id of the service point"
            ),
            "status_id": fields.Integer(required=False),
            "start_date": fields.DateTime(required=False),
            "end_date": fields.DateTime(required=False),
        },
    )
    combined_parser = reqparse.RequestParser()
    combined_parser.add_argument(
        "file", location="files", type=FileStorage, required=True, help="Document file"
    )
    receipt_list_req = order_api.model(
        "receipt_list_req",
        {
            "user_id": fields.Integer(
                required=False, description="Id of the user placing order"
            ),
            "order_id": fields.Integer(
                required=False, description="Id of the service point"
            ),
            "search_by": fields.String(
                required=False, description="Id of the service point"
            ),
            "status_id": fields.Integer(required=False),
            "start_date": fields.DateTime(required=False),
            "end_date": fields.DateTime(required=False),
        },
    )
    order_status_change_dto = order_api.model(
        "order_status_change_dto",
        {
            "order_id": fields.Integer(required=True, description="Id of the order"),
            "status_code": fields.String(
                required=True,
                description="Order status code you want to change the status to",
            ),
            "reject_reason": fields.String(
                required=False,
                description="Reason id status is to be changed to Rejected",
            ),
        },
    )

    order_count_res = order_api.model(
        "order_count_res",
        {"data": fields.Integer(required=False, description="count of order")},
    )

    order_success_res = order_api.model(
        "order_success_res", {"message": fields.String(required=False)}
    )

    order_stats = order_api.model(
        "order_stats",
        {
            "total_order": fields.Integer(required=False),
            "pending_approval": fields.Integer(required=False),
            "rejected_approval": fields.Integer(required=False),
            "accepted_approval": fields.Integer(required=False),
            "inprogress_approval": fields.Integer(required=False),
            "pending_order": fields.Integer(required=False),
            "rejected__order": fields.Integer(required=False),
            "accepted_order": fields.Integer(required=False),
            "inprogress_order": fields.Integer(required=False),
            "total_order_amount": fields.Integer(required=False),
            "pending_approval_amount": fields.Integer(required=False),
            "cancelled_amount": fields.Integer(required=False),
            "accepted_approval_amount": fields.Integer(required=False),
            "pending_order_amount": fields.Integer(required=False),
            "cancelled_order_amount": fields.Integer(required=False),
            "accepted_order_amount": fields.Integer(required=False),
        },
    )

    appointment_order = order_api.model(
        "appointment_order",
        {
            "order_id": fields.Integer(
                required=False, description="Id of the order"
            ),  # Assuming you want a BigInteger for the ID
            "city_id": fields.Integer(required=False, description="Id of the city"),
            "status_id": fields.Integer(required=False, description="Id of the status"),
            "service_point_id": fields.Integer(
                required=False, description="Id of the service point"
            ),
            "amount": fields.Float(required=False),
            "offer_amount": fields.Float(required=False),
            "tax": fields.Float(required=False),
            "payable_amount": fields.Float(required=False),
            "customer": fields.Nested(_user_dto, attribute="user"),
            "qty_balance": fields.Integer(),
            "created_at": fields.DateTime(),
        },
    )
