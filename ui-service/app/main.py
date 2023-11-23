from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import hashlib

app = FastAPI()

USER_SERVICE_URL = "http://user-service:3002"

class User(BaseModel):
    username: str
    password: str

# Endpoint to create a new user
@app.post("/create_user")
async def create_user(user: User):
    try:
        user.password = hashlib.md5(user.password.encode()).hexdigest()
        response = requests.post(f"{USER_SERVICE_URL}/create_user", data=user.model_dump_json())
        response.raise_for_status()
        created_user = response.json()
        return created_user
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to delete a user
@app.delete("/delete_user/{user_id}")
async def delete_user(user_id: int):
    try:
        response = requests.delete(f"{USER_SERVICE_URL}/delete_user/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to suspend a user
@app.put("/suspend_user/{user_id}")
async def suspend_user(user_id: int):
    try:
        response = requests.delete(f"{USER_SERVICE_URL}/suspend_user/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to simulate user login
@app.post("/login")
async def login():
    # Get the user details from username
    # Match the hashed password
    # Then say login success else error
    return {"message": "Login successful"}

# Endpoint to simulate user logout
@app.post("/logout/{user_id}")
async def logout(user_id: int):
    return {"message": f"Logout successful for user_id : {user_id}"}
