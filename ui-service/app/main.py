from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import requests
import hashlib
import datetime

app = FastAPI()

USER_SERVICE_URL = "http://user-service:3002"
AUCTION_SERVICE_BASE_URL = "http://auction-service:3003"
ITEM_SERVICE_URL = "http://item-service:3004"
ITEM_SERVICE_URL = "http://item-service:3004"

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


############## ITEM SERVICE APIs ####################

class Category(BaseModel):
    id: int
    created_at: datetime.datetime
    category: str

class CategoryCreate(BaseModel):
    category: str

class Item(BaseModel):
    id: int
    created_at: datetime.datetime 
    updated_at: datetime.datetime
    quantity: int
    description: str
    shipping_cost: float
    category_id: int
    initial_bid_price: float
    final_bid_price: Optional[float]
    seller_id: int
    buyer_id: Optional[int]
    photo_url1: Optional[str]
    photo_url2: Optional[str]
    photo_url3: Optional[str]
    photo_url4: Optional[str]
    photo_url5: Optional[str]


class DeleteItem(BaseModel):
    user_id: int
    item_id: int


@app.post("/category")
async def create_category(category: CategoryCreate):
    url = f"{ITEM_SERVICE_URL}/category"
    try:
        response = requests.post(url, json=category.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.get("/categories", response_model=list)
def get_categories():
    url = f"{ITEM_SERVICE_URL}/categories"
    headers = {'Accept': 'application/json'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500)
    return response.json()

@app.get("/category/{category_id}", response_model=dict)
def get_category_by_id(category_id: int):
    url = f"{ITEM_SERVICE_URL}/category/{category_id}"
    print("url", url)
    headers = {'Accept': 'application/json'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500)
    return response.json()

@app.post("/items")
async def create_item(item: Item, user_id: int):
    url = f"{ITEM_SERVICE_URL}/items"
    try:
        response = requests.post(url + f"?user_id={user_id}", json=item.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.get("/items/{item_id}")
async def get_item_by_item_id(item_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/items/{item_id}"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.get("/items/category/{category_id}")
async def get_item_by_category_id(category_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/items/category/{category_id}"
        response = requests.get(url, headers={'Accept': 'application/json'})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.get("/items/seller/{seller_id}", response_model=list)
def get_item_by_seller_id(seller_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/items/seller/{seller_id}"
        response = requests.get(url, headers={'Accept': 'application/json'})
        response.raise_for_status()
        print("response", response)
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.delete("/items")
async def delete_item_by_id(deleteItem: DeleteItem):
    try:
        response = requests.delete(f"{ITEM_SERVICE_URL}/items", params=deleteItem.model_dump())
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
   
    return response.content

@app.get("/items/{min_initial_bid_price}/{max_initial_bid_price}", response_model=list)
async def get_items_by_price(min_initial_bid_price: float, max_initial_bid_price: float):
    try:
        url = f"{ITEM_SERVICE_URL}/items/{min_initial_bid_price}/{max_initial_bid_price}"
        response = requests.get(url, headers={'Accept': 'application/json'})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()


@app.get("/search/{search_term}", response_model=list)
async def search_items(search_term: str):
    try:
        url = f"{ITEM_SERVICE_URL}/search/{search_term}"
        response = requests.get(url, headers={'Accept': 'application/json'})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.put("/items_edit/{item_id}", response_model=dict)
def update_item(item_id: int, item_with_new_values: dict):
    try:
        url = f"{ITEM_SERVICE_URL}/items_edit/{item_id}"
        response = requests.put(url, json=item_with_new_values)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()