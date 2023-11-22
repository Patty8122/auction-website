
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from user import Customer, Admin, db_params_user
from cart import Cart, CartManagement, db_params_cart

app = FastAPI()

@app.get("/test")
def read_test():
    return {"message": "User service reached!"}


# Dependency to get the database connection and cursor
def get_db(db_params):
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        yield (cursor, conn)
    finally:
        conn.close()

# Dependency to get the current user from the token
# def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token")), db=Depends(get_db(db_params_user))):
#     # In a real-world scenario, you would validate the token and retrieve user information
#     # Here, for simplicity, we'll create a dummy user
#     dummy_user = Customer(user_id=1, name="John Doe", status=1, email="john@example.com", seller_rating="5.0", user_name="john_doe")
#     return dummy_user

@app.post("/create_user/")
def create_user(name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str, db=Depends(get_db(db_params_user))):
    cursor, conn = db
    customer = Customer(user_id=None, name=name, status=status, email=email, seller_rating=seller_rating, user_name=user_name)
    user_id = customer.create_user(name, status, email, seller_rating, user_name, user_password, cursor)
    conn.commit()
    return {"user_id": user_id}

@app.get("/get_user/{user_id}")
def get_user(user_id: int, db=Depends(get_db(db_params_user))):
    cursor, _ = db
    user_info = Customer.get_user_by_id(user_id, cursor)
    return user_info

@app.put("/update_user/{user_id}")
def update_user(user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: strt, db=Depends(get_db(db_params_user))):
    cursor, conn = db
    Customer.update_user(user_id, name, status, email, seller_rating, user_name, user_password, cursor)
    conn.commit()
    return {"message": "User updated successfully"}

@app.delete("/delete_user/{user_id}")
def delete_user(user_id: int, db=Depends(get_db(db_params_user))):
    cursor, conn = db
    Customer.delete_user(user_id, cursor)
    conn.commit()
    return {"message": "User deleted successfully"}

@app.post("/create_cart/")
def create_cart(user_id: int, db=Depends(get_db(db_params_cart))):
    cursor, conn = db
    cart_management = CartManagement(cursor, conn)
    cart_id = cart_management.create_cart(user_id)
    conn.commit()
    return {"cart_id": cart_id}

@app.post("/add_item_to_cart/{cart_id}")
def add_item_to_cart(cart_id: int, item_id: int, quantity: int, db=Depends(get_db(db_params_cart))):
    cursor, conn = db
    cart_management = CartManagement(cursor, conn)
    cart_management.add_item_to_cart(cart_id, item_id, quantity)
    conn.commit()
    return {"message": "Item added to cart successfully"}

@app.get("/get_cart_items/{cart_id}")
def get_cart_items(cart_id: int, db=Depends(get_db(db_params_cart))):
    cursor, conn = db
    cart_management = CartManagement(cursor, conn)
    items = cart_management.get_items_from_cart(cart_id)
    return {"items": items}
