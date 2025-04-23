from flask import jsonify


# def handle_abort(exception):
#     if exception.data.get("error", None):
#         status_code = exception.code
#         error_message = exception.data.get("error", "Unknown Error")
#         return {"error": {"message": error_message}}, status_code
#     else:
#         return exception
def expired_token_callback(jwt_header, jwt_payload):
    token_type = jwt_payload["type"]
    if token_type == "access":
        return jsonify({"error": "TOKEN_EXPIRED"}), 401
    elif token_type == "refresh":
        return jsonify({"error": "SESSION_EXPIRED"}), 401


def handle_abort(exception):
    if hasattr(exception, "data") and isinstance(exception.data, dict):
        status_code = getattr(exception, "code", 500)

        # Check if "error" or "description" is present in exception.data
        error_message = exception.data.get(
            "error",
            exception.data.get("description"),
        )
        error_message = {"error": error_message}

        # If neither "error" nor "description" is found, use the entire exception.data
        if error_message is None:
            error_message = exception.data

        return error_message, status_code
    else:
        # If exception.data is not present or not a dictionary, return the original exception
        # return exception.args
        return {"error": exception.args[0]}, 500
