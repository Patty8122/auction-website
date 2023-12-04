# Classes to handle user roles
from abc import ABC, abstractmethod
import psycopg2
# from flaskr.model.user import User
from psycopg2.extras import RealDictCursor
from fastapi import HTTPException, status


table_name: str = "users"


class User(ABC):

    db_params_user = {
    "host": "db-service",
    "database": "userdb",
    "user": "postgres",
    "password": "postgres",
    "port": 5432  
    }
    '''
    Abstract class representing any associated user
    '''
    @ abstractmethod
    def __init__(self, user_id: str, username : str, status: int,
                 email: str, seller_rating: int, user_type: str):
        self.user_id = user_id
        self.username = username
        self.status = status
        self.email = email
        self.seller_rating = seller_rating
        self.user_type = user_type

    def get_db(self):
        conn = psycopg2.connect(**self.db_params_user)
        cursor = conn.cursor()
        return cursor, conn

    def login(self, username: str, password: str):
        cursor, conn = self.get_db()

        # Check if the user credentials are valid
        select_query = f"SELECT * FROM {table_name} WHERE username = %s AND password = %s"
        cursor.execute(select_query, (username, password))
        existing_user = cursor.fetchone()

        if not existing_user:
            # raise Exception("Invalid username or password")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
        
        if existing_user[2] != 1:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Blocked or suspended user")


        # Update the user's status to active (1)
        update_status_query = f"UPDATE {table_name} SET active = 1 WHERE user_id = %s"
        cursor.execute(update_status_query, (existing_user[0],))
        conn.commit()

        return {"user_id":existing_user[0], "username" :existing_user[1], "status": existing_user[2],
                    "email" : existing_user[3], "seller_ rating" : existing_user[4], "user_type" : existing_user[6]}
    
    def logout(self, user_id: int):
        cursor, conn = self.get_db()

        # Update the user's status to inactive (0)
        update_status_query = f"UPDATE {table_name} SET active = 0 WHERE user_id = %s"
        cursor.execute(update_status_query, (user_id,))
        conn.commit()


class Customer(User):
    def __init__(self):
        super().__init__(user_id=None, username=None, status=None, email=None, seller_rating=None, user_type=None)
        self.cursor, self.conn = self.get_db()

    def create_user(self, username: str, email: str, password: str):
        existing_users = self.get_user(username)
        if existing_users:
            raise Exception("The user name already exists. Please try a different one.")

        insert_query = f"""
            INSERT INTO {table_name} (username, status, email, seller_rating, password, user_type, active)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING user_id
        """
        self.cursor.execute(insert_query, (username, 1, email, 5, password, "customer", 0))
        user_id = self.cursor.fetchone()[0]
        self.conn.commit()

        return user_id

    def get_user_by_id(self, user_id):
        select_query = f"SELECT * FROM {table_name} WHERE user_id = %s"
        self.cursor.execute(select_query, (user_id,))
        existing_user = self.cursor.fetchone()

        if not existing_user:
            print("Not an existing user")
            return

        return {"user_id":existing_user[0], "username" :existing_user[1], "status": existing_user[2],
                    "email" : existing_user[3], "seller_ rating" : existing_user[4], "user_type" : existing_user[6]}
    

    def get_user(self, username):
        select_query = f"SELECT * FROM {table_name} WHERE username = %s"
        self.cursor.execute(select_query, (username,))
        existing_user = self.cursor.fetchone()

        if not existing_user:
            print("Not an existing user")
            return
        print(existing_user)
        return {"user_id":existing_user[0], "username" :existing_user[1], "status": existing_user[2],
                    "email" : existing_user[3], "seller_ rating" : existing_user[4], "user_type" : existing_user[6]}
    
    def get_all_users(self) -> list:
        select_all_query = f"SELECT user_id, username, status, email, active, comments FROM {table_name}"
        self.cursor.execute(select_all_query)
        return self.cursor.fetchall()
    

    def update_user(self, user_id: int, status: int = None, email: str = None, seller_rating: str = None):
        existing_user = self.get_user_by_id(user_id)
        if not existing_user:
            raise Exception("This user does not exist")
        if existing_user:
            print(existing_user)
            if existing_user["status"] == -1:
                raise Exception("Blocked users cannot be updated.")

        set_clause = ", ".join(f"{field} = %s" for field, value in [('status', status), ('email', email), ('seller_rating', seller_rating)] if value is not None)

        update_query = f"""
            UPDATE {table_name} SET
            {set_clause}
            WHERE user_id = %s
        """

        # Build the parameter values for the query
        query_params = [value for value in [status, email, seller_rating, user_id] if value is not None]

        # Execute the update query
        self.cursor.execute(update_query, query_params)
        self.conn.commit()
    
    def delete_user(self, user_id: int):
        # Check if the user exists before deletion
        exists_query = f"SELECT EXISTS(SELECT 1 FROM {table_name} WHERE user_id = %s)"
        self.cursor.execute(exists_query, (user_id,))
        exists_before = self.cursor.fetchone()[0]

        if not exists_before:
            return False

        # Perform the deletion
        delete_query = f"DELETE FROM {table_name} WHERE user_id = %s"
        self.cursor.execute(delete_query, (user_id,))
        self.conn.commit()

        # Check if the user still exists
        self.cursor.execute(exists_query, (user_id,))
        exists_after = self.cursor.fetchone()[0]

        # Return True if the user was deleted, False otherwise
        return not exists_after

    def suspend_user(self, user_id: int):
        update_query = f"UPDATE {table_name} SET status = 0 WHERE user_id = %s"
        self.cursor.execute(update_query, (user_id,))
        self.conn.commit()

    def add_comments(self, user_id: int, comment: str):
        update_comment_query = f"Update {table_name} SET comments = %s WHERE user_id = %s"
        self.cursor.execute(update_comment_query, (comment, user_id))
        self.conn.commit()

    def remove_comments(self, user_id: int):
        remove_comment_query = f"UPDATE {table_name} SET comments = NULL WHERE user_id = %s"
        self.cursor.execute(remove_comment_query, (user_id,))
        self.conn.commit()


    def login(self, username: str, password: str):
        # Your login implementation for Customer
        # Make sure to call the base class (User) login method to handle common logic
        user_info = super().login(username, password)

        # Additional logic specific to Customer login
        # ...

        return user_info

    def logout(self, user_id: int):
        # Your logout implementation for Customer
        # Make sure to call the base class (User) logout method to handle common logic
        super().logout(user_id)

        # Additional logic specific to Customer logout
        # ...


class Admin(User):
    def __init__(self):
        super().__init__(user_id=None, username=None, status=None, email=None, seller_rating=None, user_type=None)
        self.cursor, self.conn = self.get_db()
    # def get_db(self):
    #     conn = psycopg2.connect(**self.db_params)
    #     cursor = conn.cursor()
    #     return cursor, conn

    def remove_and_block_user(self, user_id):
        existing_user = self.get_user_by_id(user_id)
        if not existing_user:
            raise Exception("User does not exist")
        if existing_user.status == -1:
            raise Exception("User is already blocked")

        remove_and_block_query = f"UPDATE {table_name} SET status = -1 WHERE user_id = %s"
        self.cursor.execute(remove_and_block_query, (user_id,))
        self.conn.commit()

    def login(self, username: str, password: str):
        # Your login implementation for Customer
        # Make sure to call the base class (User) login method to handle common logic
        user_info = super().login(username, password)

        # Additional logic specific to Customer login
        # ...

        return user_info

    def logout(self, user_id: int):
        # Your logout implementation for Customer
        # Make sure to call the base class (User) logout method to handle common logic
        super().logout(user_id)

        # Additional logic specific to Customer logout
        # ...



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