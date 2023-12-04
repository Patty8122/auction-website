import { query } from './db.js';

const createAuctions = async () => {
    const auctionsData = [
        { item_id: 1, seller_id: 1, start_time: '2023-11-26 09:00:00', end_time: '2023-12-08 17:00:00', starting_price: 0, bid_increment: 5, status: 'pending' },
        { item_id: 2, seller_id: 2, start_time: '2023-11-26 10:00:00', end_time: '2023-12-08 18:00:00', starting_price: 0, bid_increment: 5, status: 'pending' }
    ];

    for (const auction of auctionsData) {
        await query('INSERT INTO auctions(item_id, seller_id, start_time, end_time, starting_price, status, bid_increment) VALUES($1, $2, $3, $4, $5, $6, $7)',
            [auction.item_id, auction.seller_id, auction.start_time, auction.end_time, auction.starting_price, auction.status, auction.bid_increment]);
    }
};

const placeBids = async () => {
    // Assuming the first two auctions have IDs 1 and 2
    const bidsData = [
        { auction_id: 1, user_id: 1, bid_amount: 20 },
        { auction_id: 1, user_id: 2, bid_amount: 30 },
        { auction_id: 2, user_id: 1, bid_amount: 70 },
        { auction_id: 2, user_id: 2, bid_amount: 80 }
    ];

    for (const bid of bidsData) {
        await query('INSERT INTO bids(auction_id, user_id, bid_amount) VALUES($1, $2, $3)',
            [bid.auction_id, bid.user_id, bid.bid_amount]);
    }
};

const initTestData = async () => {
    // First check for existing data
    const auctions = await query('SELECT * FROM auctions');
    const bids = await query('SELECT * FROM bids');
    if (auctions.length > 0 || bids.length > 0) {
        console.log("Test data already initialized.");
        return;
    }

    try {
        await createAuctions();
        await placeBids();
        console.log("Test data initialized successfully.");
    } catch (error) {
        console.error("An error occurred: ", error);
    }
};

initTestData();