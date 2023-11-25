from typing import Optional
from pydantic import BaseModel
import datetime

# Item model
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import DateTime

class ItemIn(BaseModel):
    created_at: str = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    updated_at: str = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    quantity: Optional[int] = 1
    description: Optional[str] = 'No description provided'
    shipping_cost: Optional[float] = 0.0
    category_id: int
    initial_bid_price: float
    final_bid_price: Optional[float] = None
    # seller_id: int
    buyer_id: Optional[int] = None
    photo_url1: Optional[str] = None
    photo_url2: Optional[str] = None
    photo_url3: Optional[str] = None
    photo_url4: Optional[str] = None
    photo_url5: Optional[str] = None


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

    class Config:
        orm_mode = True

class CategoryIn(BaseModel):
    created_at: str = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    category: str

class Category(BaseModel):
    id: int
    created_at: datetime.datetime
    category: str
    class Config:
        orm_mode = True
