from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

table_name: str = "cart"

db_params_user = {
    "host": "db-service",
    "database": "userdb",
    "user": "postgres",
    "password": "postgres",
    "port": 5432  # Add the port here
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
    def __init__(self):
        self.cursor, self.conn = self.get_db()

    def get_db(self):
        conn = psycopg2.connect(**db_params_user)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        return cursor, conn

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
            checkout_time = carts[0][-1]
            if checkout_time is not None and checkout_time < datetime.now():
                cart_id = self.create_cart(user_id)

        return cart_id

    def create_cart(self, user_id):
        user_id = str(user_id)
        current_time = datetime.now()
        query = "INSERT INTO cart (user_id, create_time) VALUES (%s, %s) RETURNING cart_id"
        query_data = (user_id, current_time)
        try:
            self.cursor.execute(query, query_data)
            cart_id = self.cursor.fetchone()["cart_id"]

            self.conn.commit()
        except psycopg2.Error as err:
            raise Exception(err)

        # Retrieve the newly created cart id
        
        return cart_id

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
    
    def delete_cart(self, cart_id):
        delete_query = f"DELETE FROM {table_name} WHERE cart_id = %s"
        self.cursor.execute(delete_query, (cart_id,))
        self.conn.commit()


    def remove_item_from_cart(self, cart_id, item_id):
        query = "DELETE FROM cart_item WHERE cart_id = %s AND item_id = %s"
        query_data = (cart_id, item_id)
        try:
            self.cursor.execute(query, query_data)
            self.conn.commit()
        except psycopg2.Error as err:
            self.conn.rollback()
            raise Exception(err)

