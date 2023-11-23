from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from user import Customer, Admin
from cart import CartManagement

app = FastAPI()

@app.get("/test")
def read_test():
    return {"message": "User service reached!"}

@app.post("/create_user/")
def create_user(name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str, user_type: str):
    customer = Customer()
    user_id = customer.create_user(name, status, email, seller_rating, user_name, user_password, user_type)
    return {"user_id": user_id}
    
@app.get("/get_user/{user_id}")
def get_user(user_id: int):
    user_info = Customer.get_user_by_id(user_id)
    return user_info

@app.put("/update_user/{user_id}")
def update_user(user_id: int, name: str, status: int, email: str, seller_rating: str, user_name: str, user_password: str):
    Customer.update_user(user_id, name, status, email, seller_rating, user_name, user_password)
    return {"message": "User updated successfully"}

@app.delete("/delete_user/{user_id}")
def delete_user(user_id: int):
    Customer.delete_user(user_id)
    return {"message": "User deleted successfully"}

@app.post("/create_cart/")
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
