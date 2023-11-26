from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from app.user import Customer
from app.cart import CartManagement
import psycopg2

@asynccontextmanager
async def lifespan(app: FastAPI):
   
    create_tables()
    print("Table created")
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

@app.get("/test")
def read_test():
    return {"message": "User service reached!"}

@app.post("/create_user/")
def create_user(username: str, email: str, password: str):
    customer = Customer()
    user_id = customer.create_user(username=username, email=email, password=password)
    return {"user_id": user_id}
    
@app.get("/get_user/{user_id}")
def get_user(user_id: int):
    customer= Customer()
    user_info = customer.get_user_by_id(user_id)
    return user_info

@app.put("/update_user/{user_id}")
def update_user(user_id: int, status: int = None, email: str = None, seller_rating: str = None):
    customer= Customer()
    customer.update_user(user_id, status=status, email=email, seller_rating=seller_rating)
    return {"message": "User updated successfully"}

@app.put("/suspend_user/{user_id}")
def suspend_user(user_id: int):
    customer= Customer()
    customer.suspend_user(user_id)
    return {"message": "User suspended successfully"}

@app.delete("/delete_user/{user_id}")
def delete_user(user_id: int):
    customer= Customer()
    customer.delete_user(user_id)
    return {"message": "User deleted successfully"}

@app.post("/create_cart/{user_id}")
def create_cart(user_id: int):
    cart_management = CartManagement()
    cart_id = cart_management.create_cart(user_id)
    return {"cart_id": cart_id}

@app.post("/add_item_to_cart/{cart_id}")
def add_item_to_cart(cart_id: int, item_id: int, quantity: int):
    cart_management = CartManagement()
    cart_management.add_item_to_cart(cart_id, item_id, quantity)
    return {"message": "Item added to cart successfully"}

@app.get("/get_cart_items/{cart_id}")
def get_cart_items(cart_id: int):
    cart_management = CartManagement()
    items = cart_management.get_items_from_cart(cart_id)
    return {"items": items}

@app.delete("/remove_item_from_cart/{user_id}/{item_id}")
async def remove_item_from_cart(user_id: int, item_id: int):
    cart_management = CartManagement()
    try:
        cart_id  = cart_management.get_current_cart(user_id)
        cart_management.remove_item_from_cart(cart_id, item_id)
        return {"message": "Item removed from cart successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login Endpoint
@app.post("/login/")
def login(username: str, password: str):
    user = Customer()
    user_info = user.login(username=username, password=password)
    return {"user_info": user_info}

# Logout Endpoint
@app.post("/logout/{user_id}")
def logout(user_id: int):
    user = Customer()
    user.logout(user_id)
    return {"message": "User logged out successfully"}



def create_tables():
    # Database connection parameters
    db_params = {
        "host": "db-service",
        "database": "userdb",
        "user": "postgres",
        "password": "postgres",
        "port": 5432
    }


    # SQL query to create the users table
    create_users_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        status INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        seller_rating INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type VARCHAR(255) DEFAULT 'customer' NOT NULL,
        active INT DEFAULT 0 NOT NULL
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
    cursor.execute(create_cart_item_table_query)
    cursor.execute(create_watchlist_table_query)

    # Commit the changes
    conn.commit()

    # Close the cursor and connection
    cursor.close()
    conn.close()


# create_tables()