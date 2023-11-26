module.exports.up = function(pgm) {
    console.log('Executing up migration...');
    // populate categories table
    pgm.sql("INSERT INTO categories (category) VALUES ('Antiques')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Art')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Baby')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Books')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Business & Industrial')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Cameras & Photo')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Cell Phones & Accessories')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Clothing, Shoes & Accessories')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Coins & Paper Money')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Collectibles')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Computers/Tablets & Networking')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Consumer Electronics')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Crafts')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Dolls & Bears')");
    pgm.sql("INSERT INTO categories (category) VALUES ('DVDs & Movies')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Entertainment Memorabilia')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Everything Else')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Gift Cards & Coupons')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Health & Beauty')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Home & Garden')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Jewelry & Watches')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Music')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Musical Instruments & Gear')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Pet Supplies')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Pottery & Glass')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Real Estate')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Specialty Services')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Sporting Goods')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Sports Mem, Cards & Fan Shop')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Stamps')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Tickets & Experiences')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Toys & Hobbies')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Travel')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Video Games & Consoles')");
    pgm.sql("INSERT INTO categories (category) VALUES ('Other')");
    // populate items table
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Abstract Canvas Painting', 15.00, 2, 50.00, 1)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Sculpture: Marble Statue', 20.00, 2, 200.00, 3)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Harry Potter Book Set', 12.00, 4, 30.00, 3)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Vintage Poetry Collection', 8.00, 4, 15.00, 2)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Harry Potter Book Set', 12.00, 4, 30.00), 3");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Vintage Poetry Collection', 8.00, 4, 15.00, 2)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Smartphone: Latest Model', 10.00, 11, 500.00, 1)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Laptop: High Performance', 20.00, 11, 800.00, 4)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Designer Leather Jacket', 15.00, 8, 120.00, 2)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Running Shoes: Limited Edition', 10.00, 8, 80.00, 3)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Vintage Comic Books Set', 12.00, 10, 50.00, 4)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Rare Coin Collection', 18.00, 10, 150.00, 1)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Garden Furniture Set', 25.00, 20, 200.00, 5)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Kitchen Appliances Bundle', 15.00, 20, 120.00, 2)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('LEGO Star Wars Millennium Falcon', 10.00, 29, 100.00, 3)");
    pgm.sql("INSERT INTO items (description, shipping_cost, category_id, initial_bid_price, seller_id) VALUES ('Board Game Collection', 8.00, 29, 30.00, 4)");

    console.log('It worked...')
    process.exit(0)
}

module.exports.down = function(pgm) {
    console.log('Executing down migration...');
    pgm.sql("DELETE FROM items");
    pgm.sql("DELETE FROM categories");
    console.log('It worked...')
    process.exit(0)
}

    