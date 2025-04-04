from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi import Body, FastAPI
from pydantic import BaseModel
from fuzzywuzzy import fuzz

import datetime

from typing import Optional, List
from typing import Union

from fastapi import Depends, FastAPI, HTTPException

from . import models

from sqlalchemy import DateTime, Float, Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update, delete

import re
from fastapi import Query


#################### DATABASE ####################
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@db-service:5432/itemdb"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(String)
    category = Column(String, unique=True)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True)
    title = Column(String)
    shipping_cost = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    initial_bid_price = Column(Float)
    final_bid_price = Column(Float, nullable=True)
    seller_id = Column(Integer, nullable=True)
    buyer_id = Column(Integer, nullable=True)
    listing_status = Column(Boolean, nullable=True)
    photo_url1 = Column(String)
    photo_url2 = Column(String, nullable=True)
    photo_url3 = Column(String, nullable=True)
    photo_url4 = Column(String, nullable=True)
    photo_url5 = Column(String, nullable=True)

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    max_price = Column(Float, nullable=True)
    



    # category = relationship("Category", back_populates="items")


def create_tables():
    Base.metadata.create_all(bind=engine)
    # Base.metadata.upgrade(bind=engine)

#################### END DATABASE ####################


app = FastAPI()


# @app.on_event("startup")
# def on_startup():
#     create_tables()
#     print("Tables created")


@app.get("/test")
def read_test():
    return {"message": "Item service test !"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/category", response_model=models.Category, status_code=201)
async def create_category(category: models.CategoryIn, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=404, detail="Database not found")

    # Check if category already exists
    existing_category = db.execute(
        select(Category).where(Category.category == category.category)
    ).scalar()

    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    db_category = Category(
        created_at=category.created_at,
        category=category.category)

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


async def fetch_categories(db):
    stmt = select(Category)
    result = db.execute(stmt)
    db_categories = result.scalars().all()
    for category in db_categories:
        yield [category.id, category.category]


@app.get("/categories", response_model=list, status_code=200)
async def get_categories(db: Session = Depends(get_db)):
    return [category[1] async for category in fetch_categories(db)]


@app.get("/category/{category_id}", response_model=models.Category, status_code=200)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    stmt = select(Category).where(Category.id == category_id)

    db_category = db.execute(stmt).scalar()

    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return db_category

@app.get("/category-by-name/{category_name}", response_model=list[dict], status_code=200)
async def get_categories_by_name(category_name: str, db: Session = Depends(get_db)):
    stmt = select(Category).where(Category.category == category_name)
    result = db.execute(stmt)
    db_categories = result.scalars().all()

    if not db_categories:
        raise HTTPException(status_code=404, detail="No categories found with this name")

    return [{"id": category.id, "category": category.category} for category in db_categories]

@app.put("/category/{category_id}", response_model=models.Category, status_code=200)
async def update_category(category_id: int, new_category_data: models.CategoryIn, db: Session = Depends(get_db)):
    # Check if new category name already exists
    existing_category = db.execute(
        select(Category).where(Category.category == new_category_data.category)
    ).scalar()
    if existing_category:
        raise HTTPException(status_code=400, detail="Category name already exists")

    # Update the category
    db.execute(
        update(Category)
        .where(Category.id == category_id)
        .values(category=new_category_data.category)
    )
    db.commit()

    updated_category = db.execute(
        select(Category).where(Category.id == category_id)
    ).scalar()

    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")

    return updated_category

@app.delete("/category/{category_id}", status_code=200)
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    # Check if category exists
    existing_category = db.execute(
        select(Category).where(Category.id == category_id)
    ).scalar()

    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Delete the category
    db.execute(
        delete(Category).where(Category.id == category_id)
    )
    db.commit()

    return {"message": "Category deleted successfully"}

@app.post("/watchlist", response_model=models.Watchlist, status_code=201)
async def create_watchlist(category_id: int, max_price: float, user_id: int, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=404, detail="Database not found")

    watchlist = models.WatchlistIn(
        user_id=user_id,
        category_id=category_id,
        max_price=max_price)
    

    db_watchlist = Watchlist(
        user_id=watchlist.user_id,
        category_id=watchlist.category_id,
        max_price=watchlist.max_price)

    db.add(db_watchlist)
    db.commit()
    db.refresh(db_watchlist)

    return db_watchlist

@app.get("/watchlists/{user_id}", response_model=List[models.Watchlist], status_code=200)
async def get_watchlist(user_id: int, db: Session = Depends(get_db)):
    stmt = select(Watchlist).where(Watchlist.user_id == user_id)
    db_watchlist = db.execute(stmt).scalars().all()
    return db_watchlist


@app.get("/watchlist/{watchlist_id}", response_model=models.Watchlist, status_code=200)
async def get_watchlist(watchlist_id: int, db: Session = Depends(get_db)):
    stmt = select(Watchlist).where(Watchlist.id == watchlist_id)
    db_watchlist = db.execute(stmt).scalar()
    return db_watchlist


@app.delete("/watchlist", status_code=200)
async def delete_watchlist(user_id: int, category_id: int, db: Session = Depends(get_db)):
    db_watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).filter(Watchlist.category_id == category_id).first()

    if db_watchlist is None:
        raise HTTPException(status_code=400, detail="Watchlist does not exist")

    db.delete(db_watchlist)
    db.commit()
    return {"ok": True, "message": "Watchlist deleted"}

@app.put("/watchlist", response_model=models.Watchlist, status_code=200)
async def update_watchlist(category_id: int, user_id: int, max_price: float, db: Session = Depends(get_db)):

    db_watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).filter(Watchlist.category_id == category_id).first()

    if db_watchlist is None:
        raise HTTPException(status_code=400, detail="Watchlist does not exist")

    db_watchlist.max_price = max_price
    db.commit()
    db.refresh(db_watchlist)
    return db_watchlist

async def fetch_watchlist(db_watchlist, db):
    for watchlist in db_watchlist:
        yield [watchlist.user_id, watchlist.category_id, watchlist.max_price]


from sqlalchemy import and_



@app.get("/watchlist_receive", response_model=list, status_code=200)
async def get_watchlist_receive(item_id: int, db: Session = Depends(get_db)):
    # get item
    stmt = select(Item).where(Item.id == item_id)
    db_item = db.execute(stmt).scalar()

    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # get if any watchlist matches
    stmt = (
        select(Watchlist)
        .where(Watchlist.category_id == db_item.category_id)
        .where(and_(Watchlist.max_price >= (db_item.initial_bid_price + db_item.shipping_cost), Watchlist.category_id == db_item.category_id))
    )
    db_watchlist = db.execute(stmt).scalars().all()

    # return all the user_ids
    return [watchlist[0] async for watchlist in fetch_watchlist(db_watchlist, db)]


@app.get("/watchlist_receive/{user_id}", response_model=list, status_code=200)
async def get_watchlist_receive(user_id: int, db: Session = Depends(get_db)):
    # get item
    stmt = select(Watchlist).where(Watchlist.user_id == user_id)
    db_watchlist = db.execute(stmt).scalars().all()

    # return all the user_ids
    return [{"category_id": watchlist[1], "max_price": watchlist[2]} async for watchlist in fetch_watchlist(db_watchlist, db)]


@app.post("/items", response_model=Union[models.Item, None], status_code=201)
def create_item_user(item: models.ItemIn, user_id: int, db: Session = Depends(get_db)):
    item_with_new_values = Item(
        **item.model_dump()
    )

    item_with_new_values.seller_id = user_id

    db.add(item_with_new_values)
    db.commit()
    db.refresh(item_with_new_values)

    return item_with_new_values


@app.get("/items", response_model=List[models.Item], status_code=200)
def get_items(db: Session = Depends(get_db)):
    stmt = select(Item)
    items = db.execute(stmt).scalars().all()
    return items


@app.get("/items/{item_id}", response_model=models.Item, status_code=200)
def get_item(item_id: int, db: Session = Depends(get_db)):
    stmt = select(Item).where(Item.id == item_id)
    item = db.execute(stmt).scalar()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return item


@app.get("/items/category/{category_id}", response_model=Union[List[models.Item], None], status_code=200)
def get_items_by_category(category_id: int, db: Session = Depends(get_db)):
    #   , skip: int = 0, limit: int = 100):
    stmt = select(Category).where(Category.id == category_id)
    db_category = db.execute(stmt).scalar()

    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    print(db_category.id, db_category.category)

    stmt = select(Item).where(Item.category_id == category_id)
    print(stmt)

    items = db.execute(stmt)
    print(items)
    items = items.scalars().all()
    print(items)

    return items


@app.get("/items/seller/{seller_id}", response_model=Union[List[models.Item], None], status_code=200)
def get_items(seller_id: int, db: Session = Depends(get_db)):
    stmt = select(Item).where(Item.seller_id == seller_id)
    items = db.execute(stmt).scalars().all()
    return items


@app.delete("/items", status_code=200)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    # does user own item?
    db_item = db.query(Item).filter(Item.id == item_id).first()

    print("db_item: ", db_item)

    if db_item is None:
        raise HTTPException(status_code=400, detail="Item does not exist")

    # if db_item.seller_id != user_id and db_item.seller_id != 1:  # 1 is admin
    #     print("db_item.seller_id: ", db_item.seller_id, " user_id: ", user_id)
    #     raise HTTPException(status_code=400, detail="User does not own item")

    # delete item
    db.delete(db_item)
    db.commit()
    return {"ok": True, "message": "Item deleted"}

@app.put("/items_auction/{item_id}", response_model=models.Item, status_code=200)
def update_item_auction(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()

    if db_item is None:
        raise HTTPException(status_code=400, detail="Item does not exist")

    # update item
    db_item.listing_status = True
    db_item.updated_at = str(
        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    # commit changes
    db.commit()
    db.refresh(db_item)
    return db_item
                
@app.get("/items/{min_initial_bid_price}/{max_initial_bid_price}", response_model=List[models.Item], status_code=200)
def get_items_by_price(min_initial_bid_price: float, max_initial_bid_price: float, db: Session = Depends(get_db)):
    if min_initial_bid_price is not None and max_initial_bid_price is not None:
        stmt = select(Item).where(Item.initial_bid_price >= min_initial_bid_price).where(
            Item.initial_bid_price <= max_initial_bid_price)
        items = db.execute(stmt).scalars().all()
        return items
    elif min_initial_bid_price is not None:
        stmt = select(Item).where(
            Item.initial_bid_price >= min_initial_bid_price)
        items = db.execute(stmt).scalars().all()
        return items
    elif max_initial_bid_price is not None:
        stmt = select(Item).where(
            Item.initial_bid_price <= max_initial_bid_price)
        items = db.execute(stmt).scalars().all()
        return items

    return []

@app.get("/watchlist_items", response_model=Union[List[models.Item], None], status_code=200)
async def get_watchlist_items(watchlist_id: int, db: Session = Depends(get_db)):
    stmt = select(Watchlist).where(Watchlist.id == watchlist_id)
    watchlist = db.execute(stmt).scalar()

    stmt = select(Item) \
        .where(Item.category_id == watchlist.category_id) \
            .where(and_(Item.initial_bid_price <= watchlist.max_price, Item.category_id == watchlist.category_id))
    items = db.execute(stmt).scalars().all()
    return items


@app.put("/items_edit/{item_id}", response_model=models.Item, status_code=200)
def update_item(item_id: int, item_with_new_values: dict = Body(...),
                db: Session = Depends(get_db)):
    # does user own item?
    db_item = db.query(Item).filter(Item.id == item_id).first()

    if db_item is None:
        raise HTTPException(status_code=400, detail="Item does not exist")

    # if db_item.seller_id != user_id and db_item.seller_id != 1: # 0 is admin
    #     raise HTTPException(status_code = 400, detail="User does not own item")

    # update item
    for key, value in item_with_new_values.items():
        if key == "category_id":
            db_item.category_id = value
        elif key == "title":
            db_item.title = value
        elif key == "quantity":
            db_item.quantity = value
        elif key == "shipping_cost":
            db_item.shipping_cost = value
        elif key == "initial_bid_price":
            db_item.initial_bid_price = value
        elif key == "photo_url1":
            db_item.photo_url1 = value
        elif key == "photo_url2":
            db_item.photo_url2 = value
        elif key == "photo_url3":
            db_item.photo_url3 = value
        elif key == "photo_url4":
            db_item.photo_url4 = value
        elif key == "photo_url5":
            db_item.photo_url5 = value
        else:
            raise HTTPException(status_code=400, detail="Invalid key")

    db_item.updated_at = str(
        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    # commit changes
    db.commit()
    db.refresh(db_item)
    return db_item


async def fetch_items(db):
    stmt = select(Item)
    result = db.execute(stmt)
    db_items = result.scalars().all()
    for item in db_items:
        yield item


@app.get("/search/{search_term}", response_model=List[models.Item], status_code=200)
async def search_items(search_term: str, db: Session = Depends(get_db)):
    # find items with search term looking at title
    categories = [category[1] async for category in fetch_categories(db)]
    categories_id = [category[0] async for category in fetch_categories(db)]
    categories = [category.lower() for category in categories]
    categories = [category.replace(" ", "") for category in categories]
    print(categories)
    search_term = search_term.lower()
    search_term = search_term.replace(" ", "")
    print(search_term)
    for category in categories:
        # if the search term is a substring of a category
        if fuzz.partial_ratio(search_term, category) >= 80:
            print("search term is a category", category, search_term)
            # search term is a category
            stmt = select(Item).where(Item.category_id ==
                                      categories_id[categories.index(category)])
            items = db.execute(stmt).scalars().all()
            return items

    stmt = select(Item).where(Item.title.ilike(f"%{search_term}%"))
    items = db.execute(stmt).scalars().all()
    if items:
        return items

    items = fetch_items(db)
    items = [item async for item in items if fuzz.partial_ratio(search_term, item.title.lower().replace(" ", "")) >= 80]
    print(items)
    return items


# Update final bid price and get items by final bid price range
# @app.get("/items/{min_current_bid_price}/{max_current_bid_price}", response_model=List[models.Item], status_code=200)
# def get_items_by_bid_price(min_current_bid_price: float, max_current_bid_price: float, db: Session = Depends(get_db)):
#     # Update final bid price
#     stmt = select(Item).where(Item.final_bid_price == None)
#     items = db.execute(stmt).scalars().all()

#     for item in items:
#         item.final_bid_price = item.get_current_bid_price()
#         db.commit()
#         db.refresh(item)

#     if min_current_bid_price is not None and max_current_bid_price is not None:
#         stmt = select(Item).where(Item.final_bid_price >= min_current_bid_price).where(Item.initial_bid_price <= max_current_bid_price)
#         items = db.execute(stmt).scalars().all()
#         return items
#     elif min_current_bid_price is not None:
#         stmt = select(Item).where(Item.final_bid_price >= min_current_bid_price)
#         items = db.execute(stmt).scalars().all()
#         return items
#     elif max_current_bid_price is not None:
#         stmt = select(Item).where(Item.final_bid_price <= max_current_bid_price)
#         items = db.execute(stmt).scalars().all()
#         return items
#     else:
#         raise HTTPException(status_code = 400, detail="Invalid price range")
