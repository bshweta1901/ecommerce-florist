import logging
from flask import has_request_context, request


class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None
        return super().format(record)


formatter = RequestFormatter(
    "[%(asctime)s] %(remote_addr)s requested %(url)s:--> %(levelname)s in %(module)s: %(message)s"
)


def set_logger_config():

    logger = logging.getLogger()
    consoleHandler = logging.StreamHandler()
    consoleHandler.setFormatter(formatter)
    logger.addHandler(consoleHandler)

    fileHandler = logging.FileHandler("Assubo.log")
    fileHandler.setFormatter(formatter)
    logger.addHandler(fileHandler)
