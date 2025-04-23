from .....extensions import db
from ....utils.model.common_model import CommonModel
from ...appoinment.model.appointment_model import AppointmentMaster
from sqlalchemy import distinct
from ....utils.model.predefined_master import PredefinedMaster


class OrderMaster(CommonModel, db.Model):
    __tablename__ = "order_master"
    order_id = db.Column(
        db.BigInteger, primary_key=True
    )  # Assuming you want a BigInteger for the ID
    city_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )
    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=True)
    department_id = db.Column(
        db.BigInteger,
        db.ForeignKey("company_departments.company_department_id"),
        nullable=True,
    )
    status_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )
    approval_status_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )
    service_point_id = db.Column(
        db.BigInteger, db.ForeignKey("service_point.service_point_id"), nullable=True
    )
    shipping_address_id = db.Column(
        db.BigInteger, db.ForeignKey("user_address.address_id"), nullable=True
    )
    billing_address_id = db.Column(
        db.BigInteger, db.ForeignKey("user_address.address_id"), nullable=True
    )
    vehicle_id = db.Column(db.BigInteger, db.ForeignKey("vehicle.id"), nullable=True)
    city = db.relationship(
        "PredefinedMaster", foreign_keys=[city_id], backref="order_as_city"
    )
    service_point = db.relationship(
        "ServicePoint",
        foreign_keys=[service_point_id],
        backref="order_as_service_point",
    )
    user = db.relationship(
        "User", foreign_keys=[user_id], backref="user_from_order_master"
    )
    company_id = db.Column(
        db.BigInteger, db.ForeignKey("company_master.company_id"), nullable=True
    )
    company = db.relationship(
        "CompanyMaster", foreign_keys=[company_id], backref="company_from_order_master"
    )
    company_user_id = db.Column(
        db.BigInteger, db.ForeignKey("company_user.company_user_id"), nullable=True
    )
    company_user = (
        db.relationship(
            "CompanyUser",
            foreign_keys=[company_user_id],
            backref="company_user_from_order_master",
        ),
    )
    department = db.relationship(
        "CompanyDepartment",
        foreign_keys=[department_id],
        backref="company_department_from_order_master",
    )
    sp_user_id = db.Column(
        db.BigInteger, db.ForeignKey("service_user.sp_user_id"), nullable=True
    )
    sp_user = db.relationship(
        "ServiceUser",
        foreign_keys=[sp_user_id],
        backref="service_user_from_order_master",
    )
    service_start_time_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )
    assigned_status_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )

    assigned_status = db.relationship(
        "PredefinedMaster",
        foreign_keys=[assigned_status_id],
        backref="order_assigned_staff__status",
    )

    amount = db.Column(db.Float)
    tax = db.Column(db.Float)
    coupon_discount = db.Column(db.Float)
    coupon_code = db.Column(db.String)
    payable_amount = db.Column(db.Float)
    total_amount = db.Column(db.Float)
    paid_amount = db.Column(db.Float)
    service_start_date = db.Column(db.Date)
    service_end_time = db.Column(db.DateTime)
    purchase_amount = db.Column(db.Float)
    mechmile_earn = db.Column(db.Float)
    sp_earn = db.Column(db.Float)
    product_amount = db.Column(db.Float)
    wallet_discount = db.Column(db.Float)
    # product = db.relationship('ProductMaster', secondary=order_item, backref=db.backref('order_master', lazy='dynamic'))
    service_start_time = db.relationship(
        "PredefinedMaster",
        foreign_keys=[service_start_time_id],
        backref="order_service_start_time_id",
    )
    status = db.relationship(
        "PredefinedMaster", foreign_keys=[status_id], backref="order_status"
    )
    approval_status = db.relationship(
        "PredefinedMaster",
        foreign_keys=[approval_status_id],
        backref="order_approval_status",
    )
    shipping_address = db.relationship(
        "UserAddress",
        foreign_keys=[shipping_address_id],
        backref="order_shipping_address",
    )
    billing_address = db.relationship(
        "UserAddress",
        foreign_keys=[billing_address_id],
        backref="order_billing_address",
    )
    vehicle = db.relationship(
        "Vehicle", foreign_keys=[vehicle_id], backref="order_vehicle"
    )
    is_use_wallet = db.Column(db.Boolean)
    is_custom = db.Column(db.Boolean, default=False)
    order_items = db.relationship(
        "OrderItem",
        backref="order_item_ref",
        lazy="dynamic",
        primaryjoin="OrderMaster.order_id == OrderItem.order_id",  # Specify the join condition
    )
    reject_reason = db.Column(db.String(500))
    instructions = db.Column(db.String(500))
    coupon_id = db.Column(
        db.BigInteger, db.ForeignKey("coupon_master.coupon_id"), nullable=True
    )
    coupon = db.relationship(
        "CouponMaster", foreign_keys=[coupon_id], backref="order_coupon"
    )
    mechmiles_staff_id = db.Column(
        db.BigInteger, db.ForeignKey("users.id"), nullable=True
    )
    mechmiles_staff = db.relationship(
        "User",
        foreign_keys=[mechmiles_staff_id],
        backref="mechmiles_staff_from_order_master",
    )

    payment_status_id = db.Column(
        db.BigInteger, db.ForeignKey("predefined_master.id"), nullable=True
    )
    payment_status = db.relationship(
        "PredefinedMaster",
        foreign_keys=[payment_status_id],
        backref="order_payment",
    )
    invoice_url = db.Column(db.String())
    invoice_path = db.Column(db.String())
    total_quantity = None
    admin_user = None
    admin_user_dept = None
    service_point_user = None
    appointment_date = None

    @property
    def appointment_date(self):
        # Use a default value of 0 if sp_quantity is None
        query = (
            AppointmentMaster.query.filter(
                AppointmentMaster.is_delete == "N",
                AppointmentMaster.order_id == self.order_id,
            )
            .with_entities(
                distinct(AppointmentMaster.appointment_id),
                AppointmentMaster.service_start_date,
                PredefinedMaster.name.label("service_start_time"),
            )
            .outerjoin(
                PredefinedMaster,
                PredefinedMaster.predefined_id
                == AppointmentMaster.service_start_time_id,
            )  # Left join to handle missing service_start_time
            .all()
        )
        return query

    @property
    def total_quantity(self):
        # Use a default value of 0 if sp_quantity is None
        return sum(
            item.item_quantity if item.item_quantity is not None else 0
            for item in self.order_items
        )

    @classmethod
    def get_order_master(cls):
        return cls.get_order_master()

    def update_order(self, updated_order_data):
        # Update the order attributes based on the updated_order_data
        for key, value in updated_order_data.items():
            setattr(self, key, value)

        # Commit the changes to the database
        db.session.commit()

    # def save(self):
    #     db.session.add(self)
    #     db.session.commit()

    # def save_with_product(self,product_List):
    #     for product in product_List:
    #         product_id = self.query.filter_by(product_id=product).first()
    #         if product_id is not None:
    #             self.products.append(product_id)
    #     db.session.add(self)
    #     db.session.commit()
