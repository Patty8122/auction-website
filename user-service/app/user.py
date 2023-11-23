# Classes to handle user roles
from abc import ABC, abstractmethod, abstractproperty
# from client_helper import *
import requests
import psycopg2
# from flaskr.model.user import User
from psycopg2.extras import RealDictCursor



# db_address: str = "account_service_db:27017"  # Needs to be the mongo docker container's name
# db_name: str = "accountdb"
table_name: str = "users"

db_params_user = {
    "host": "your_postgres_host",
    "database": "your_database_name",
    "user": "your_username",
    "password": "your_password"
}

class User(ABC):
    '''
    Abstract class representing any associated user
    '''
    @ abstractmethod
    def __init__(self, user_id: str, name: str, status: int,
                 email: str, seller_rating: str, user_name: str, user_type: str):
        self.user_id = user_id
        self.name = name
        self.status = status
        self.email = email
        self.seller_rating = seller_rating
        self.user_name = user_name
        self.user_type = user_type
        




class Customer(User):
    def __init__(self, user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str, db_params: dict):
        super().__init__(user_id, name, status, email, seller_rating, user_name)
        self.db_params = db_params
        self.cursor, self.conn = self.get_db()

    def get_db(self):
        conn = psycopg2.connect(**self.db_params)
        cursor = conn.cursor()
        return cursor, conn

    def create_user(self, name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str, user_type: str):
        existing_users = self.get_user(user_name, user_password)
        if existing_users:
            raise Exception("The user name already exists. Please try a different one.")

        insert_query = f"""
            INSERT INTO {table_name} (name, status, email, seller_rating, user_name, user_password, user_type)
            VALUES (%s, %s, %s, %s, %s, %s. %s)
            RETURNING id
        """
        self.cursor.execute(insert_query, (name, status, email, seller_rating, user_name, user_password, user_type))
        user_id = self.cursor.fetchone()[0]

        return user_id

    def get_user_by_id(self, user_id):
        select_query = f"SELECT * FROM {table_name} WHERE id = %s"
        self.cursor.execute(select_query, (user_id,))
        existing_user = self.cursor.fetchone()

        if not existing_user:
            raise Exception("This user does not exist.")

        return User(existing_user[0], existing_user[1], existing_user[2],
                    existing_user[3], existing_user[4], existing_user[5])

    # def get_user_by_username(self, user_name):
    #     select_query = f"SELECT * FROM {table_name} WHERE user_name = %s"
    #     self.cursor.execute(select_query, (user_name,))
    #     return self.cursor.fetchall()

    def get_user(self, user_name, user_password):
        select_query = f"SELECT * FROM {table_name} WHERE user_name = %s AND user_password = %s"
        self.cursor.execute(select_query, (user_name, user_password))
        existing_user = self.cursor.fetchone()

        if not existing_user:
            raise Exception("The user name or password is not correct")

        return User(existing_user[0], existing_user[1], existing_user[2],
                    existing_user[3], existing_user[4], existing_user[5])

    def update_user(self, user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str):
        existing_user = self.get_user_by_id(user_id)
        if not existing_user:
            raise Exception("This user does not exist")
        if existing_user:
            if existing_user.status == -1:
                raise Exception("Blocked users cannot be updated.")

        update_query = f"""
            UPDATE {table_name} SET
            name = %s, status = %s, email = %s, seller_rating = %s,
            user_name = %s, user_password = %s
            WHERE id = %s
        """
        self.cursor.execute(update_query, (name, status, email, seller_rating, user_name, user_password, user_id))

    def delete_user(self, user_id: int):
        delete_query = f"DELETE FROM {table_name} WHERE id = %s"
        self.cursor.execute(delete_query, (user_id,))

    def suspend_user(self, user_id: int):
        update_query = f"UPDATE {table_name} SET status = 0 WHERE id = %s"
        self.cursor.execute(update_query, (user_id,))


class Admin(User):
    def __init__(self, user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str, db_params: dict):
        super().__init__(user_id, name, status, email, seller_rating, user_name)
        self.db_params = db_params
        self.cursor, self.conn = self.get_db()

    def get_db(self):
        conn = psycopg2.connect(**self.db_params)
        cursor = conn.cursor()
        return cursor, conn

    def remove_and_block_user(self, user_id):
        existing_user = self.get_user_by_id(user_id)
        if not existing_user:
            raise Exception("User does not exist")
        if existing_user.status == -1:
            raise Exception("User is already blocked")

        remove_and_block_query = f"UPDATE {table_name} SET status = -1 WHERE id = %s"
        self.cursor.execute(remove_and_block_query, (user_id,))



    # def stop_auction_early(self, auction_id):
    #     # Logic to stop an auction early
    #     pass
    # def add_modify_remove_category(self, action, category_name=None):
    #     # Logic to add, modify, or remove categories
    #     pass

    # def view_flagged_items(self):
    #     return self.user_manager.get_flagged_items()

    # def view_auctions_in_progress(self, sort_by="ending_soonest"):
    #     # Logic to view auctions currently in progress with sorting capability
    #     pass

    # def examine_metrics_closed_auctions(self, timeframe):
    #     # Logic to examine metrics for closed auctions in a given timeframe
    #     pass

    # def examine_support_emails(self):
    #     # Logic to examine emails received by customer support
    #     pass