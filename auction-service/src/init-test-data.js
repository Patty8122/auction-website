import { query } from './db.js';

const createAuctions = async () => {
    const auctionsData = [
        { item_id: 1, seller_id: 1, start_time: '2023-11-26 09:00:00', end_time: '2023-12-08 17:00:00', starting_price: 0, bid_increment: 5, status: 'open' },
        { item_id: 2, seller_id: 2, start_time: '2023-11-26 10:00:00', end_time: '2023-12-08 18:00:00', starting_price: 0, bid_increment: 5, status: 'open' }
    ];

    for (const auction of auctionsData) {
        await query('INSERT INTO auctions(item_id, seller_id, start_time, end_time, starting_price, status, bid_increment) VALUES($1, $2, $3, $4, $5, $6, $7)',
            [auction.item_id, auction.seller_id, auction.start_time, auction.end_time, auction.starting_price, auction.status, auction.bid_increment]);
    }
};

const placeBids = async () => {
    // Assuming the first two auctions have IDs 1 and 2
    const bidsData = [
        { auction_id: 1, user_id: 1, bid_amount: 0 },
        { auction_id: 1, user_id: 2, bid_amount: 0 },
        { auction_id: 2, user_id: 1, bid_amount: 0 },
        { auction_id: 2, user_id: 2, bid_amount: 0 }
    ];

    for (const bid of bidsData) {
        await query('INSERT INTO bids(auction_id, user_id, bid_amount) VALUES($1, $2, $3)',
            [bid.auction_id, bid.user_id, bid.bid_amount]);
    }
};

const initTestData = async () => {
    try {
        await createAuctions();
        await placeBids();
        console.log("Test data initialized successfully.");
    } catch (error) {
        console.error("An error occurred: ", error);
    }
};

initTestData();
