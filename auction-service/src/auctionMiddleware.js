import { query } from './db.js';

const fetchAuctionData = async (req, res, next) => {
    const auctionId = req.params.id;

    try {
        const auctionResult = await query('SELECT start_time, end_time, status, winning_bid_id, bid_increment FROM auctions WHERE id = $1', [auctionId]);
        if (auctionResult.rows.length === 0) {
            return res.status(404).send('Auction not found');
        }

        req.auctionDetails = auctionResult.rows[0];
        next();
    } catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).send('Error fetching auction');
    }
};

export { fetchAuctionData };
