# db_setup/create_tables.py
import psycopg2


def create_tables():
    # Database connection parameters
    db_params = {
        "host": "db-service",
        "database": "userdb",
        "user": "postgres",
        "password": "postgres",
        "port": 5432  # Add the port here
    }


    # SQL query to create the users table
    create_users_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        status INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        seller_rating INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type VARCHAR(255) DEFAULT 'customer' NOT NULL,
        active INT NOT NULL
    );
    """

    # SQL query to create the cart table
    create_cart_table_query = """
    CREATE TABLE IF NOT EXISTS cart (
        cart_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) UNIQUE NOT NULL,
        create_time TIMESTAMP NOT NULL,
        checkout_time TIMESTAMP
    );
    """

    # SQL query to create the cart_item table
    create_cart_item_table_query = """
    CREATE TABLE IF NOT EXISTS cart_item (
        cart_item_id SERIAL PRIMARY KEY,
        cart_id INT REFERENCES cart(cart_id) NOT NULL,
        item_id INT NOT NULL,
        quantity INT NOT NULL
    );
    """




    # SQL query to create the watchlist table
    create_watchlist_table_query = """
    CREATE TABLE IF NOT EXISTS watchlist (
        user_id INT NOT NULL,
        item_id INT NOT NULL,
        PRIMARY KEY (user_id, item_id)
    );
    """

    # Connect to the database
    conn = psycopg2.connect(**db_params)

    # Create a cursor
    cursor = conn.cursor()

    # Execute the queries to create tables
    cursor.execute(create_users_table_query)
    cursor.execute(create_cart_table_query)
    cursor.execute(create_watchlist_table_query)

    # Commit the changes
    conn.commit()

    # Close the cursor and connection
    cursor.close()
    conn.close()


# create_tables()