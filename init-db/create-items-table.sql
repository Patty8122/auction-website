
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(240) NOT NULL
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER DEFAULT 1,
    description VARCHAR(240) DEFAULT '',
    shipping_cost DECIMAL  DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    initial_bid_price DECIMAL NOT NULL,
    final_bid_price DECIMAL,
    seller_id INTEGER NOT NULL,
    buyer_id INTEGER,
    photo_url1 VARCHAR,
    photo_url2 VARCHAR,
    photo_url3 VARCHAR,
    photo_url4 VARCHAR,
    photo_url5 VARCHAR
);


