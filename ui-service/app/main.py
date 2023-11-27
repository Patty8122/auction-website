from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import requests
import hashlib
import datetime

app = FastAPI()

USER_SERVICE_URL = "http://user-service:3002"
AUCTION_SERVICE_BASE_URL = "http://auction-service:3003"

############## USER SERVICE APIs ####################
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
        user_id = response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": f"User with username : {user.username} has been created", "user_id": user_id}

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
        user_info = response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": f"Login successful for user: {user.username}", "user_info": user_info}

# Endpoint to simulate user logout
@app.post("/logout/{user_id}")
async def logout(user_id: int):
    try:
        response = requests.post(f"{USER_SERVICE_URL}/logout/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": f"Logout successful for user_id : {user_id}"}

############## AUCTION SERVICE APIs ####################

class AuctionCreate(BaseModel):
    itemId: int
    startDateTime: str
    endDateTime: str
    startingPrice: float
    sellerId: int
    bidIncrement: float

class BidCreate(BaseModel):
    bidAmount: float
    userId: int
    
@app.post("/auctions", response_model=dict)
async def create_auction(auction: AuctionCreate):
    url = f"{AUCTION_SERVICE_BASE_URL}/auctions"
    try:
        data = auction.model_dump_json()
        print(f"Data is : {data}")
        response = requests.post(url, json=auction.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.get("/auctions", response_model=list)
async def get_auctions():
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.get("/auctions/{auction_id}", response_model=dict)
async def get_auction_by_id(auction_id: int):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.post("/auctions/{auction_id}/bids", response_model=dict)
async def place_bid(auction_id: int, bid: BidCreate):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/bids"
        response = requests.post(url, json=bid.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))

    return response.json()

@app.get("/auctions/{auction_id}/bids", response_model=list)
async def get_bids(auction_id: int):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/bids"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))

    return response.json()

@app.get("/auctions/{auction_id}/current-bid", response_model=list)
async def get_current_bid(auction_id: int):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/current-bid"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))

    return response.json()

@app.get("/auctions/{auction_id}/final-bid", response_model=list)
async def get_final_bid(auction_id: int):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/final-bid"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.get("/users/{user_id}/auctions", response_model=list)
async def get_auctions_by_user(user_id: int):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/users/{user_id}/auctions"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()