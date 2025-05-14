from flask import request
from flask_jwt_extended import jwt_required
from app.main.business.service.order.order_service import save_order
from app.main.business.util.order.order_dto import OrderDto


api = OrderDto.order_api
_order = OrderDto.order_save_req
_custom_order = OrderDto.custom_order_save_req
_update_order = OrderDto.custom_order_update_req
_receipt = OrderDto.receipt_save_req
_order_res = OrderDto.order
_receipt_res = OrderDto.receipt_res
_order_list_req = OrderDto.order_list_req
_receipt_list_req = OrderDto.receipt_list_req
_order_stats = OrderDto.order_stats
_order_count_res = OrderDto.order_count_res
_order_status_change_dto = OrderDto.order_status_change_dto
_order_success_res = OrderDto.order_success_res
_upload_doc = OrderDto.combined_parser
from flask_restx import Resource


@api.route("/save")
class OrderSave(Resource):
    @api.doc("save_order")
    @api.expect(_order)
    # @api.marshal_with(_order_success_res)
    # @api.marshal_with(_order_success_res)
    @jwt_required()
    def post(self):
        """Saves or Sends order for approval"""
        return save_order(request.json)


@api.route("/custom-order/save")
class OrderSave(Resource):
    @api.doc("save_custom_order")
    @api.expect(_custom_order)
    # @api.marshal_with(_order_success_res)
    # @api.marshal_with(_order_success_res)
    @jwt_required()
    def post(self):
        """Saves or Sends order for approval"""
        return save_custom_order(request.json)


@api.route("/custom-order/update")
class OrderSave(Resource):
    @api.doc("update_custom_order")
    @api.expect(_update_order)
    # @api.marshal_with(_order_success_res)
    # @api.marshal_with(_order_success_res)
    @jwt_required()
    def put(self):
        """Saves or Sends order for approval"""
        return update_custom_order(request.json)


@api.route("/")
class OrderList(Resource):
    @api.doc("order list")
    @api.expect(_order_list_req)
    @api.marshal_list_with(_order_res)
    @jwt_required()
    def post(self):
        """Get order list"""
        orders = get_orders(request.json)
        return orders, 200


@api.route("/<order_id>")
@api.param("order_id", "The Order identifier")
class OrderDetails(Resource):
    @api.doc("order details")
    @api.marshal_with(_order_res)
    @jwt_required()
    def get(self, order_id):
        """Get order details"""
        orders = get_order_by_id(order_id)
        return orders, 200


@api.route("/count")
class OrderCount(Resource):
    @api.doc("order count")
    @api.expect(_order_list_req)
    @api.marshal_with(_order_count_res)
    @jwt_required()
    def post(self):
        """Get order count"""
        return get_orders_count(request.json), 200


@api.route("/stats")
class OrderStats(Resource):
    @api.doc("order stats")
    @api.expect(_order)
    @api.marshal_with(_order_stats)
    @jwt_required()
    def post(self):
        """Get order stats"""
        return get_order_stats(request.json), 200


@api.route("/change-status")
class OrderStatus(Resource):
    @api.doc("order stats")
    @api.expect(_order_status_change_dto)
    @api.response(200, "Status successfully changed.")
    @api.marshal_with(_order_success_res)
    @jwt_required()
    def patch(self):
        """Get order stats"""
        order = request.json
        status_code = order["status_code"]
        message, status_code = change_approval_order_status(
            order=order, status_code=status_code
        )
        return message, status_code


@api.route("/change-order-status")
class OrderStatus(Resource):
    @api.doc("change order status")
    @api.expect(_order_status_change_dto)
    @api.response(200, "Status successfully changed.")
    @api.marshal_with(_order_success_res)
    @jwt_required()
    def patch(self):
        """Get order stats"""
        order = request.json
        status_code = order["status_code"]
        change_order_status(order=order, status_code=status_code)
        return {"message": "Status successfully changed."}, 200


@api.route("/invoice/<int:order_id>")
class OrderInvoice(Resource):
    @api.response(200, "pdf generate")
    @jwt_required()
    def get(self, order_id):
        """Get order invoice"""

        url_path, pdf_path = order_invoice(order_id)
        return {"message": url_path}, 200


@api.route("/update/<order_id>")  # New route for updating an order
@api.param("order_id", "The Order identifier")
class OrderUpdate(Resource):
    @api.doc("update_order")
    @api.expect(_order)  # Assuming the request format is similar to the save request
    @api.response(200, "Order successfully updated.")
    @api.response(404, "Order not found.")
    @jwt_required()
    def patch(self, order_id):  # Use the PATCH method for updating
        """Update an existing order"""
        return update_order(
            order_id, request.json
        )  # Call the update_order function with the order_id and request data


@api.route("/order-export")
class OrderExportResource(Resource):
    @jwt_required()
    @api.doc(" Order Export", body=_order_list_req)
    @api.expect(_order_list_req)
    def post(self):
        data = request.json
        file_path = export_orders(data)
        return {"message": file_path}, 200


@api.route("/order-assigned/order/<int:order_id>/staff/<int:staff_id>")
class OrderAssignedResource(Resource):
    @jwt_required()
    @api.doc("order assigned to a staff")
    # @api.expect(_order_list_req)
    def get(self, order_id, staff_id):
        # data = request.json
        res = assigned_order(order_id, staff_id)
        return res, 200


@api.route("/order-unassigned/order/<int:order_id>")
class OrderUnassignedResource(Resource):
    @api.doc("order unassigned to a staff")
    @jwt_required()
    # @api.expect(_order_list_req)
    def get(self, order_id):
        # data = request.json
        res = unassigned_order(order_id)
        return res, 200


@api.route("/receipt/save")
class ReceiptSave(Resource):
    @api.doc("save_receipt", body=_receipt)
    @api.expect(_receipt)
    # @jwt_required()
    def post(self):
        """Saves receipt for approval"""
        return save_receipt(request.json)


@api.route("/receipt/list")
class ReceiptList(Resource):
    @api.doc("receipt list")
    @api.expect(_receipt_list_req)
    @api.marshal_list_with(_receipt_res)
    # @jwt_required()
    def post(self):
        """Get order list"""
        receipt = get_receipt_list(request.json)
        return receipt, 200


@api.route("/receipt/<receipt_id>")
@api.param("receipt_id", "The Receipt identifier")
class ReceiptDetails(Resource):
    @api.doc("receipt details")
    @api.marshal_with(_receipt_res)
    # @jwt_required()
    def get(self, receipt_id):
        """Get receipt details"""
        receipt = get_receipt_by_id(receipt_id)
        return receipt, 200


@api.route("/receipt/count")
class ReceiptCount(Resource):
    @api.doc("receipt count")
    @api.expect(_receipt_list_req)
    @api.marshal_with(_order_count_res)
    @jwt_required()
    def post(self):
        """Get order count"""
        return get_receipt_count(request.json), 200


@api.route("/receipt-update/<receipt_id>")  # New route for updating an order
@api.param("receipt_id", "The Order identifier")
class ReceiptUpdate(Resource):
    @api.doc("update_receipt")
    @api.expect(_order)  # Assuming the request format is similar to the save request
    @api.response(200, "Receipt successfully updated.")
    @api.response(404, "Receipt not found.")
    @jwt_required()
    def patch(self, receipt_id):  # Use the PATCH method for updating
        """Receipt an existing order"""
        return update_receipt(
            receipt_id, request.json
        )  # Call the update_order function with the order_id and request data


@api.route("/receipt/upload-transaction-doc/<int:receipt_id>")
class ReceiptUploadTransactionDoc(Resource):
    @api.doc("upload transaction document", body=_upload_doc)
    @api.expect(_upload_doc)
    def put(self, receipt_id):
        "Upload document"
        args = _upload_doc.parse_args()
        uploaded_file = args["file"]
        message, _status = upload_transaction_doc(receipt_id, uploaded_file)
        return message, _status
