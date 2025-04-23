from .....extensions import db;

from datetime import datetime


# cart_item = db.Table('cart_item',
#                       db.Column('cart_id', db.BigInteger, db.ForeignKey('card=t_master.cart_id'), primary_key=True),
#                       db.Column('product_id', db.BigInteger, db.ForeignKey('product_master.product_id'), primary_key=True),
#                       db.Column('item_quantity', db.BigInteger),
#                       db.Column('total', db.float),
#                       db.Column('discount', db.float)
#                       )

# class CartMaster(db.Model):
#     __tablename__ = 'cart_master'
#     cart_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
#     total_amount = db.Column(db.Float)
#     quantity = db.Column(db.BigInteger)
#     cart_items = db.relationship('CartItem', backref='cart_master', lazy='dynamic')
#     created_by_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=True, default=1)
#     created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#     created_by = db.relationship('User', foreign_keys=[created_by_id], backref="cart_items")


#     def calculate_total_amount(self):
#         return sum(item.total for item in self.cart_items)

#     @classmethod
#     def get_cart_master(cls):
#         return cls.get_cart_master()