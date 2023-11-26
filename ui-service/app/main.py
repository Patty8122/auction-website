from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import requests
import hashlib

app = FastAPI()

USER_SERVICE_URL = "http://user-service:3002"

class User(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

# Endpoint to create a new user
@app.post("/create_user")
async def create_user(user: User):
    try:
        user.password = hashlib.md5(user.password.encode()).hexdigest()
        response = requests.post(f"{USER_SERVICE_URL}/create_user", params=user.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": f"User with username : {user.username} has been created"}

# Endpoint to delete a user
@app.delete("/delete_user/{user_id}")
async def delete_user(user_id: int):
    try:
        response = requests.delete(f"{USER_SERVICE_URL}/delete_user/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
   
    return {"message": f"User with id : {user_id} has been deleted"}

# Endpoint to suspend a user
@app.put("/suspend_user/{user_id}")
async def suspend_user(user_id: int):
    try:
        response = requests.put(f"{USER_SERVICE_URL}/suspend_user/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": f"User with id : {user_id} has been suspended"}

# Endpoint to simulate user login
@app.post("/login")
async def login(user: User):
    try:
        user.password = hashlib.md5(user.password.encode()).hexdigest()
        response = requests.post(f"{USER_SERVICE_URL}/login/", params=user.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": f"Login successful for user: {user.username}"}

# Endpoint to simulate user logout
@app.post("/logout/{user_id}")
async def logout(user_id: int):
    try:
        response = requests.post(f"{USER_SERVICE_URL}/logout/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": f"Logout successful for user_id : {user_id}"}
