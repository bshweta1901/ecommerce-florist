
import json
from flask import request
from flask_restx import Resource
from app.main.utils.payload.predefined_dto import PredefinedDto
from app.main.utils.service import predefined_service as service
from app.main.utils.payload.common_model_dto import CommonModelDto

api = PredefinedDto.api
data_model = PredefinedDto.predefined_data
request_payload = PredefinedDto.request_payload
predefined_list = PredefinedDto.data_list


@api.route("/")
@api.response(400, "error", CommonModelDto.create_response_dto)
@api.response(500, "Internal server error", CommonModelDto.create_response_dto)
class CreatePredefinedData(Resource):
    """Handles operations for Predefined data."""
    @api.expect(data_model)
    @api.response(201, 'success', CommonModelDto.create_response_dto)
    def post(self):
        """Create a new Predefined data entry."""
        data = request.json
        return service.create_entity(data)


@api.route("/list")
class PredefinedList(Resource):
    """Handles operations for Predefined data."""

    @api.expect(request_payload)
    @api.marshal_with(predefined_list)
    def post(self):
        """Fetch all Predefined data with optional filters."""
        data = request.json
        res = service.get_all_entities(data)
        return res


@api.route("/<int:id>")
@api.param("id", "Predefined Data ID", required=True)
class Predefined(Resource):
    """Handles operations for a single Predefined data entry."""

    @api.marshal_with(data_model)
    def get(self, id):
        """Fetch a single Predefined data entry by ID."""
        return service.get_entity_by_id(id)

    @api.expect(data_model)
    @api.response(200, 'success', CommonModelDto.create_response_dto)
    def put(self, id):
        """Update an existing Predefined data entry."""
        data = request.json
        return service.update_entity(id, data)

    def patch(self, id):
        """Change the status of a Predefined data entry."""
        return service.change_status(id)

    def delete(self, id):
        """Soft delete a Predefined data entry."""
        return service.soft_delete(id)
