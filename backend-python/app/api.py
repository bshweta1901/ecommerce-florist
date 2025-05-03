from app.extensions import api as api_db

from app.main.utils.payload.common_model_dto import CommonModelDto
from .main.user.model.user_address import UserAddress
from .main.user.controller.user_controller import api as user_ns
from .main.business.controller.product.product_controller import api as product_ns
from .main.business.controller.category.category_controller import api as category_ns
from .main.business.controller.category.sub_category_controller import (
    api as sub_category_nss,
)
from .main.utils.controller.document_controller import api as document_ns
from .main.utils.controller.predefined_controller import api as predefined_ns
from .main.auth.controller.auth_controller import api as auth_ns


from .main.communication.notification.controller.fcm_notification_controller import (
    api as notification_ns,
)


from .main.communication.email.controller.email_controller import api as email_ns

from .main.communication.template.model.template_master import TemplateMaster
from app.main.communication.notification.model.communication_logs import (
    CommunicationLogs,
)


def register_namespaces(api_db):
    api_db.add_namespace(CommonModelDto.common_model_api)
    api_db.add_namespace(user_ns, path="/user")
    api_db.add_namespace(document_ns, path="/document")
    api_db.add_namespace(predefined_ns, path="/predefined")
    api_db.add_namespace(auth_ns, path="/auth")
    api_db.add_namespace(category_ns, path="/category")
    api_db.add_namespace(sub_category_nss, path="/sub-category")
    api_db.add_namespace(product_ns, path="/product")
