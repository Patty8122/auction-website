from typing import Optional
from pydantic import BaseModel
import datetime

# Item model
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import DateTime

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
    listing_status: Optional[bool] = False

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
    listing_status: bool
    seller_id: int
    buyer_id: Optional[int]
    photo_url1: Optional[str]
    photo_url2: Optional[str]
    photo_url3: Optional[str]
    photo_url4: Optional[str]
    photo_url5: Optional[str]

    class Config:
        orm_mode = True

class CategoryIn(BaseModel):
    created_at: str = str(datetime.datetime.now())
    category: str

class Category(BaseModel):
    id: int
    created_at: datetime.datetime
    category: str
    class Config:
        orm_mode = True
    
class WatchlistIn(BaseModel):
    user_id: int
    category_id: Optional[int] = None
    max_price: Optional[float] = None

class Watchlist(BaseModel):
    id: int
    user_id: int
    category_id: Optional[int] = None
    max_price: Optional[float] = None
    class Config:
        orm_mode = True
