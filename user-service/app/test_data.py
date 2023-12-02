import psycopg2
import hashlib


def hash_password(password):
   
    hashed_password = hashlib.md5(password.encode()).hexdigest()
    return hashed_password

def data_exists(cursor):
    # Check if any rows exist in the users table
    cursor.execute("SELECT EXISTS (SELECT 1 FROM users LIMIT 1);")
    return cursor.fetchone()[0]



def insert_test_data():
    # Database connection parameters
    db_params = {
        "host": "db-service",
        "database": "userdb",
        "user": "postgres",
        "password": "postgres",
        "port": 5432
    }

    # Connect to the database
    conn = psycopg2.connect(**db_params)

    # Create a cursor
    cursor = conn.cursor()

    if data_exists(cursor):
        print("Test data already exists. Skipping insertion.")
        return

    # Insert admin user
    admin_user_query = """
    INSERT INTO users (username, status, email, seller_rating, password, user_type, active)
    VALUES ('admin', 1, 'admin@example.com', 5, %s, 'admin', 1);
    """
    hashed_password = hash_password("admin")
    cursor.execute(admin_user_query, (hashed_password,))


    # Insert regular users
    for i in range(1, 5):
        user_query = f"""
        INSERT INTO users (username, status, email, seller_rating, password, user_type, active)
        VALUES ('user{i}', 1, 'user{i}@example.com', 4, %s, 'customer', 1);
        """
        hashed_password = hash_password(f"user{i}")
        cursor.execute(user_query, (hashed_password,))

    # Add comments for two users
    comment_query = """
    UPDATE users SET comments = %s WHERE username IN ('user1', 'user3');
    """
    cursor.execute(comment_query, ('This is a comment for user1.',))
    cursor.execute(comment_query, ('Another comment for user3.',))

    # Commit the changes
    conn.commit()

    # Close the cursor and connection
    cursor.close()
    conn.close()
