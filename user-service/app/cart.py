from datetime import datetime
import psycopg2
import requests
from flaskr.model.user import User
from psycopg2.extras import RealDictCursor

table_name: str = "cart"

db_params_cart = {
    "host": "your_postgres_host",
    "database": "your_database_name",
    "user": "your_username",
    "password": "your_password"
}
class Cart:
    def __init__(self, cart_id: int, user_id: str, create_time: datetime, checkout_time: datetime):
        self.cart_id = cart_id
        self.user_id = user_id
        self.create_time = create_time
        self.checkout_time = checkout_time

    def to_json(self):
        return {
            "cart_id": str(self.cart_id),
            "user_id": self.user_id,
            "create_time": str(self.create_time),
            "checkout_time": str(self.checkout_time)
        }


class CartManagement:
    def __init__(self, cursor, conn):
        self.cursor = cursor
        self.conn = conn

    def get_current_cart(self, user_id):
        query = "SELECT * FROM cart WHERE user_id = %s ORDER BY create_at DESC LIMIT 1"
        query_data = [user_id]
        try:
            self.cursor.execute(query, query_data)
        except psycopg2.Error as err:
            raise Exception(err)

        carts = self.cursor.fetchall()

        if not carts or carts[0][-1] is not None:
            # No carts found or the latest cart is checked out, create a new cart
            cart_id = self.create_cart(user_id)
        else:
            cart_id = carts[0][0]

        return cart_id

    def create_cart(self, user_id):
        user_id = str(user_id)
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        query = "INSERT INTO cart (user_id, create_at) VALUES (%s, %s) RETURNING cart_id"
        query_data = (user_id, current_time)
        try:
            self.cursor.execute(query, query_data)
            self.conn.commit()
        except psycopg2.Error as err:
            raise Exception(err)

        # Retrieve the newly created cart id
        return self.cursor.fetchone()[0]

    def add_item_to_cart(self, cart_id, item_id, quantity):
        # update cart item table
        query = "INSERT INTO cart_item (cart_id, item_id, quantity) VALUES (%s, %s, %s)"
        query_data = (cart_id, item_id, quantity)
        try:
            self.cursor.execute(query, query_data)
            self.conn.commit()
        except psycopg2.Error as err:
            raise Exception(err)

    def get_items_from_cart(self, cart_id):
        query = "SELECT * FROM cart_item WHERE cart_id = %s"
        try:
            self.cursor.execute(query, (cart_id,))
        except psycopg2.Error as err:
            raise Exception(err)

        items = self.cursor.fetchall()
        return items
