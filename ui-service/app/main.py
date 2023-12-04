from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import requests
import hashlib
import datetime
import pika
import json
import os
import datetime

app = FastAPI()

USER_SERVICE_URL = "http://user-service:3002"
AUCTION_SERVICE_BASE_URL = "http://auction-service:3003"
ITEM_SERVICE_URL = "http://item-service:3004"
ITEM_SERVICE_URL = "http://item-service:3004"

############## USER SERVICE APIs ####################
class User(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    status: Optional[int] = None
    seller_rating: Optional[str] = None

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
        data = response.json()

        return {"message": data["message"], "status": data["status"]}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to suspend a user
@app.put("/suspend_user/{user_id}")
async def suspend_user(user_id: int):
    try:
        response = requests.put(f"{USER_SERVICE_URL}/suspend_user/{user_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": f"User with id : {user_id} has been suspended"}

@app.put("/update_user/{user_id}")
async def update_user(user_id: int, email: str):
    try:
        
        response = requests.put(f"{USER_SERVICE_URL}/update_user/{user_id}?email={email}")
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": f"User with id : {user_id} has been updated"}
    
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

# Endpoint to get user details
@app.get("/get_user/{user_id}")
async def get_user_details(user_id: int):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/get_user/{user_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

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
async def get_auctions(startDateTime: str = Query(None), endDateTime: str = Query(None), seller_id: int = Query(None)):
    try:
        params = {}
        if startDateTime:
            params['startDateTime'] = startDateTime
        if endDateTime:
            params['endDateTime'] = endDateTime
        if seller_id is not None:
            params['seller_id'] = seller_id

        url = f"{AUCTION_SERVICE_BASE_URL}/auctions"
        response = requests.get(url, params=params)
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

@app.put("/auctions/{auction_id}/status", response_model=dict)
async def update_auction_status(auction_id: int, status: str):
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/status"
        response = requests.put(url, json={"status": status})
        response.raise_for_status()
    except requests.RequestException as e:
        detail = str(e.response.content) if e.response else str(e)
        raise HTTPException(status_code=500, detail=detail)
    
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

@app.get("/auctions/{auction_id}/current-bid", response_model=dict)
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

class ItemIn(BaseModel):
    created_at: str = str(datetime.datetime.now())
    updated_at: str = str(datetime.datetime.now())
    quantity: Optional[int] = 1
    title: Optional[str] = 'No title provided'
    shipping_cost: Optional[float] = 0.0
    category_id: int
    initial_bid_price: float
    final_bid_price: Optional[float] = None
    seller_id: Optional[int] = None
    buyer_id: Optional[int] = None
    photo_url1: Optional[str] = None
    photo_url2: Optional[str] = None
    photo_url3: Optional[str] = None
    photo_url4: Optional[str] = None
    photo_url5: Optional[str] = None
    # listing_status: Optional[bool] = False

class Item(BaseModel):
    id: int
    created_at: datetime.datetime 
    updated_at: datetime.datetime
    quantity: int
    title: str
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
    listing_status: bool

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

@app.put("/category/{category_id}", response_model=dict)
def change_category_name(category_id: int, category_data: dict):
    url = f"{ITEM_SERVICE_URL}/category/{category_id}"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    try:
        response = requests.put(url, headers=headers, json=category_data)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    return response.json()

@app.delete("/category/{category_id}", response_model=dict)
def delete_category(category_id: int):
    url = f"{ITEM_SERVICE_URL}/category/{category_id}"
    headers = {'Accept': 'application/json'}
    try:
        response = requests.delete(url, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    return {"message": "Category deleted successfully"}

@app.get("/category-by-name/{category_name}", response_model=list[dict])
def get_category_by_name(category_name: str):
    url = f"{ITEM_SERVICE_URL}/category-by-name/{category_name}"
    headers = {'Accept': 'application/json'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    return response.json()

@app.post("/items")
async def create_item(item: ItemIn, user_id: int):
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
async def delete_item_by_id(item_id: int):
    try:
        response = requests.delete(f"{ITEM_SERVICE_URL}/items", params={"item_id": item_id})
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


@app.put("/items_auction/{item_id}", response_model=dict)
def update_item_auction(item_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/items_auction/{item_id}"
        response = requests.put(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()



@app.post("/watchlist", response_model=dict)
async def create_watchlist(category_id: int, max_price: float, user_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist"
        response = requests.post(url, params={"category_id": category_id, "max_price": max_price, "user_id": user_id})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.get("/watchlists/{user_id}", response_model=list)
async def get_watchlist(user_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlists/{user_id}"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.get("/watchlist/{watchlist_id}", response_model=dict)
async def get_watchlist(watchlist_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist/{watchlist_id}"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.delete("/watchlist", status_code=200)
async def delete_watchlist(user_id: int, category_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist"
        response = requests.delete(url, params={"user_id": user_id, "category_id": category_id})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.content

@app.put("/watchlist", response_model=dict)
async def update_watchlist(category_id: int, max_price: float, user_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist"
        response = requests.put(url, params={"category_id": category_id, "max_price": max_price, "user_id": user_id})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    return response.json()

@app.get("/watchlist_receive", response_model=list)
async def get_watchlist_receive(item_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist_receive"
        response = requests.get(url, params={"item_id": item_id})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

@app.get("/watchlist_receive/{user_id}", response_model=list)
async def get_watchlist_receive(user_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist_receive/{user_id}"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()


@app.get("/watchlist_items", response_model=list)
async def get_watchlist_items(watchlist_id: int):
    try:
        url = f"{ITEM_SERVICE_URL}/watchlist_items"
        response = requests.get(url, params={"watchlist_id": watchlist_id})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    return response.json()

############## NOTIFICATION SERVICE APIs ####################

############## NOTIFICATION SERVICE APIs ####################

class EmailReq(BaseModel):
    from_address: Optional[str] = "teambitmasters@gmail.com"
    to_address: str
    subject: str
    body: str
    
# Connect to RabbitMQ
amqp_url = os.environ['AMQP_URL']
url_params = pika.URLParameters(amqp_url)

# connect to rabbitmq
connection = pika.BlockingConnection(url_params)
channel = connection.channel()
    
# Declare the RabbitMQ queue
queue_name = 'email_service_queue'
channel.queue_declare(queue=queue_name, durable=True)

def send_message_to_queue(message):
    # Send the message to the RabbitMQ queue
    print("Sending message to queue")
    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2,  # Make the message persistent
        )
    )
    print(f"Message sent to '{queue_name}': {message}")
    
@app.post("/email")
def post_to_email_queue(data: EmailReq):
    try:
        send_message_to_queue(data.model_dump_json())
        return {"message": "Data posted to the queue successfully."}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
############## LOGGING SERVICE APIs ####################   

# class LogReq(BaseModel):
#     timestamp: datetime.datetime.now()
#     service_name: Optional[str] = "ui-service"
#     log_type: str
#     message: str
    
# connection2 = pika.BlockingConnection(url_params)
# channel2 = connection2.channel()
# # Declare the RabbitMQ queue
# log_queue_name = 'logs_service_queue'
# channel2.queue_declare(queue=log_queue_name, durable=True)

# def send_message_to_log_queue(message):
#     # Send the message to the RabbitMQ queue
#     print("Sending message to queue")
#     channel.basic_publish(
#         exchange='',
#         routing_key=log_queue_name,
#         body=message,
#         properties=pika.BasicProperties(
#             delivery_mode=2,  # Make the message persistent
#         )
#     )
#     print(f"Message sent to '{queue_name}': {message}")
    
# @app.post("/log")
# def post_to_log_queue(data: LogReq):
#     try:
#         send_message_to_queue(data.model_dump_json())
#         return {"message": "Data posted to the Log queue successfully."}
#     except Exception as e:
#         print(f"Error: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

############## MULTI SERVICE APIs ####################

class AuctionStatus(BaseModel):
    status: str

@app.post("/start_auction/{auction_id}")
async def start_auction(auction_id: int):
    # Tasks to do when auction starts
    try:
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/status"
        response = requests.put(url, json={"status": "active"})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))

    print(f"Auction {auction_id} Started from ui-service!")

@app.post("/end_auction/{auction_id}")
async def end_auction(auction_id: int):
    # Tasks to do when auction ends
    try:
        # Get the auction details
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}"
        response = requests.get(url)
        response.raise_for_status()
        response = response.json()
        seller_id = response.get("seller_id")
        item_id = response.get("item_id")
        print(f"{seller_id=} {item_id=}")
        
        # Get item details
        url = f"{ITEM_SERVICE_URL}/items/{item_id}"
        response = requests.get(url)
        response.raise_for_status()
        response = response.json()
        item_name = response.get("title")
        print(f"{item_name=} {auction_id=}")

        # Get the final_bid for this auction
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/current-bid"
        response = requests.get(url)
        response.raise_for_status()
        response = response.json()
        final_price = response.get("bid_amount")
        winner = response.get("user_id")
        
        # Get the Seller Email
        response = requests.get(f"{USER_SERVICE_URL}/get_user/{seller_id}")
        response.raise_for_status()
        response = response.json()
        email = response.get("email")
        print(f"Seller email: {email}")
        # Email the seller that auction ended and final price
        post_to_email_queue(EmailReq(to_address=email,
                             subject=f"Auction Ended for Item {item_name}",
                             body=f"Good News! Your item {item_name} has been sold for ${final_price} !!!"))
        
        # Get the user details for the user that won
        response = requests.get(f"{USER_SERVICE_URL}/get_user/{winner}")
        response.raise_for_status()
        response = response.json()
        email = response.get("email")
        print(f"Winner email: {email}")
        
        # Email the user that has won the auction with final price
        post_to_email_queue(EmailReq(to_address=email, 
                             subject=f"You Won ! Auction Ended for Item {item_name}",
                             body=f"Congratulations! You won the auction for {item_name} for ${final_price} !!!"))
        
        # Update auction status to "ended"
        url = f"{AUCTION_SERVICE_BASE_URL}/auctions/{auction_id}/status"
        response = requests.put(url, json={"status": "complete"})
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(response.content))
    
    print(f"Auction {auction_id} Ended from ui-service!")