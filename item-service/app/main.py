from fastapi import FastAPI
from pydantic import BaseModel

from typing import Optional, List

from fastapi import Depends, FastAPI, HTTPException

from . import models, crud

from sqlalchemy import DateTime, Float, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select



#################### DATABASE ####################
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@pg_container/itemdb"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(String)
    category = Column(String)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(String)
    updated_at = Column(String)
    quantity = Column(Integer)
    description = Column(String)
    shipping_cost = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    initial_bid_price = Column(Float)
    final_bid_price = Column(Float)
    seller_id = Column(Integer)
    buyer_id = Column(Integer)
    photo_url1 = Column(String)
    photo_url2 = Column(String)
    photo_url3 = Column(String)
    photo_url4 = Column(String)
    photo_url5 = Column(String)

    # category = relationship("Category", back_populates="items")

#################### END DATABASE ####################


app = FastAPI()



@app.get("/test")
def read_test():
    return {"message": "Item service test !"}

from sqlalchemy.orm import Session
from fastapi import HTTPException

from . import models

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/category", response_model=models.Category, status_code=201)
async def create_category(category: models.CategoryIn, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code = 404, detail="Database not found")
    
    db_category = Category(
        created_at = category.created_at, 
        category=category.category)
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


@app.get("/category/{category_id}", response_model=models.Category, status_code=200)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    stmt = select(Category).where(Category.id == category_id)

    db_category = db.execute(stmt)

    if db_category.scalar() is None:
        raise HTTPException(status_code = 404, detail="Category not found")
    
    return db_category.scalar()


from typing import Union

@app.post("/items", response_model=Union[models.Item, None], status_code=201)
def create_item_user(item: models.ItemIn, user_id: int, db: Session = Depends(get_db)):
    # check if user is a valid user
    # stmt = select(models.User).where(models.User.id == user_id)
    # user = db.execute(stmt).scalar()
    # if user is None:
    #     raise HTTPException(status_code = 404, detail="User not found")

    # do not include category in item

    item_with_new_values = Item(
        **item.model_dump()
    )

    item_with_new_values.seller_id = user_id

    db.add(item_with_new_values)
    db.commit()
    db.refresh(item_with_new_values)

    return item_with_new_values

@app.get("/items/{item_id}", response_model=models.Item, status_code=200)
def get_item(item_id: int, db: Session = Depends(get_db)):
    stmt = select(Item).where(Item.id == item_id)
    item = db.execute(stmt).scalar()

    if item is None:
        raise HTTPException(status_code = 404, detail="Item not found")

    return item

@app.get("/items/category/{category_id}", response_model=Union[List[models.Item], None], status_code=200)
def get_items_by_category(category_id: int, db: Session = Depends(get_db)):
                        #   , skip: int = 0, limit: int = 100):
    stmt = select(Category).where(Category.id == category_id)
    db_category = db.execute(stmt).scalar()

    if db_category is None:
        raise HTTPException(status_code = 404, detail="Category not found")
    
    print(db_category.id, db_category.category)
    
    
    stmt = select(Item).where(Item.category_id == category_id)
    print(stmt)

    items = db.execute(stmt)
    print(items)
    items = items.scalars().all()
    print(items)

    # return items

@app.get("/items/seller/{seller_id}", response_model=List[models.Item], status_code=200)
def get_items(seller_id: int, db: Session = Depends(get_db)):
    stmt = select(Item).where(Item.seller_id == seller_id)
    items = db.execute(stmt).scalars().all()
    return items



"""

@app.get("/items/price", response_model=models.Item, status_code=200)
def get_items_with_price_range(db: Session, min_price: float, max_price: float, skip: int = 0, limit: int = 100):
    if min_price == None and max_price == None:
        raise HTTPException(status_code = 400, detail="Min price and max price cannot be null")
    
    if min_price > max_price:
        raise HTTPException(status_code = 400, detail="Min price cannot be greater than max price")
    
    if min_price < 0 or max_price < 0:
        raise HTTPException(status_code = 400, detail="Price cannot be negative")

    if min_price == None:
        return db.query(models.Item).filter(models.Item.intial_bid_price <= max_price).offset(skip).limit(limit).all()
    
    if max_price == None:
        return db.query(models.Item).filter(models.Item.intial_bid_price >= min_price).offset(skip).limit(limit).all()
    
    return db.query(models.Item).filter(models.Item.intial_bid_price >= min_price, models.Item.intial_bid_price <= max_price).offset(skip).limit(limit).all()


@app.put("/items", response_model=models.Item, status_code=200)
def update_item(db: Session, item_id: int, item_with_new_values: models.Item, user_id: int):
    # does user own item?
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()

    if db_item is None:
        raise HTTPException(status_code = 400, detail="Item does not exist")
    
    if db_item.seller_id != user_id or db_item.seller_id != 0: # 0 is admin
        raise HTTPException(status_code = 400, detail="User does not own item")
    
    # update item
    db_item = models.Item(
        **item_with_new_values.model_dump(exclude={"category"}))

    # commit changes
    db.commit()
    db.refresh(db_item)

    return db_item

@app.delete("/items", status_code=200)
def delete_item(db: Session, item_id: int, user_id: int):
    # does user own item?
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()

    if db_item is None:
        raise HTTPException(status_code = 400, detail="Item does not exist")
    
    if db_item.seller_id != user_id or db_item.seller_id != 0: # 0 is admin
        raise HTTPException(status_code = 400, detail="User does not own item")
            
    # delete item
    db.delete(db_item)
    db.commit()
    return



"""