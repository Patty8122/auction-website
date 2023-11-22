# Classes to handle user roles
from abc import ABC, abstractmethod, abstractproperty
# from client_helper import *
import requests
import psycopg2
from flaskr.model.user import User
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
    '''
    Represents a customer who can perform all functions except for user management, but only on themselves
    '''

    '''
    Represents a customer who can perform all functions except for user management, but only on themselves
    '''

    def __init__(self, user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str):
        super().__init__(user_id, name, status, email, seller_rating, user_name)

    def create_user(self, name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str, cursor):
        # Check duplicates
        existing_users = self.get_user_by_username(user_name, cursor)
        if existing_users:
            raise Exception("The user name already exists. Please try a different one.")

        insert_query = f"""
            INSERT INTO {table_name} (name, status, email, seller_rating, user_name, user_password)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        cursor.execute(insert_query, (name, status, email, seller_rating, user_name, user_password))
        user_id = cursor.fetchone()['id']

        return user_id

    def get_user_by_id(self, user_id, cursor) -> User:
        select_query = f"SELECT * FROM {table_name} WHERE id = %s"
        cursor.execute(select_query, (user_id,))
        existing_user = cursor.fetchone()

        if not existing_user:
            raise Exception("This user does not exist.")

        return User(existing_user['id'], existing_user['name'], existing_user['status'],
                    existing_user['email'], existing_user['seller_rating'], existing_user['user_name'])

    def get_user(self, user_name, user_password, cursor) -> User:
        select_query = f"SELECT * FROM {table_name} WHERE user_name = %s AND user_password = %s"
        cursor.execute(select_query, (user_name, user_password))
        existing_user = cursor.fetchone()

        if not existing_user:
            raise Exception("The user name or password is not correct")

        return User(existing_user['id'], existing_user['name'], existing_user['status'],
                    existing_user['email'], existing_user['seller_rating'], existing_user['user_name'])

    def update_user(self, user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str, cursor) -> None:
        existing_user = self.get_user(user_name, user_password, cursor)
        if not existing_user:
            raise Exception("This user does not exits")
        if existing_user:
            # Check if the existing user is blocked
            if existing_user[0]['status'] == -1:
                raise Exception("Blocked users cannot be updated.")
            
        

        update_query = f"""
            UPDATE {table_name} SET
            name = %s, status = %s, email = %s, seller_rating = %s,
            user_name = %s, user_password = %s
            WHERE id = %s
        """
        cursor.execute(update_query, (name, status, email, seller_rating, user_name, user_password, user_id))

    def delete_user(self, user_id: int, cursor) -> None:
        delete_query = f"DELETE FROM {table_name} WHERE id = %s"
        cursor.execute(delete_query, (user_id,))

    def suspend_user(self, user_id: int, cursor) -> None:
        update_query = f"UPDATE {table_name} SET status = 0 WHERE id = %s"
        cursor.execute(update_query, (user_id,))

    # def get_all_users(self, cursor) -> list:
    #     select_all_query = f"SELECT * FROM {table_name}"
    #     cursor.execute(select_all_query)
    #     return cursor.fetchall()
        

    


class Admin():
    '''
    Represents an admin who can do user management
    '''

    def __init__(self, user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str):
        super().__init__(user_id, name, status, email, seller_rating, user_name)


    

    def remove_and_block_user(self, user_id, cursor):
     
        remove_and_block_query = f"UPDATE {table_name} SET status = -1 WHERE id = %s"
        cursor.execute(remove_and_block_query, (user_id,))
        

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