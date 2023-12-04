import moment from 'moment';
import { query } from './db.js';

const validateAuction = (req, res, next) => {
    const { itemId, startDateTime, endDateTime, startingPrice } = req.body;

    // Basic field validation
    if (!itemId || !startDateTime || !endDateTime || !startingPrice) {
        return res.status(400).send('Missing required fields');
    }

    // Validate date format and logic
    const startMoment = moment(startDateTime);
    const endMoment = moment(endDateTime);

    if (!startMoment.isValid() || !endMoment.isValid()) {
        return res.status(400).send('Invalid date format');
    }

    if (startMoment.isSameOrAfter(endMoment)) {
        return res.status(400).send('End time must be after start time');
    }

    if (startMoment.isBefore(moment())) {
        return res.status(400).send('Start time must be in the future');
    }

    next();
};

const validateBid = async (req, res, next) => {
    const { bidAmount } = req.body;
    const { start_time, end_time, status, winning_bid_id, bid_increment } = req.auctionDetails;
    const currentTime = moment();

    // Check if the auction is active
    if (!currentTime.isBetween(moment(start_time), moment(end_time))) {
        return res.status(400).send('Auction is not active');
    }

    try {
        // Fetch the current highest bid using winning_bid_id
        let numericCurrentBid = 0; // Default if no bids have been placed yet
        if (winning_bid_id) {
            const winningBidResponse = await query('SELECT bid_amount FROM bids WHERE id = $1', [winning_bid_id]);
            if (winningBidResponse.rows.length > 0) {
                numericCurrentBid = parseFloat(winningBidResponse.rows[0].bid_amount);
            }
        }

        const numericBidIncrement = parseFloat(bid_increment);

        // Validate bid amount
        if (bidAmount <= numericCurrentBid || bidAmount < numericCurrentBid + numericBidIncrement) {
            return res.status(400).send(`Bid must be higher than the current bid by at least $${numericBidIncrement}`);
        }

        next();
    } catch (error) {
        console.error('Error validating bid:', error);
        res.status(500).send('Error validating bid');
    }
};

export { validateAuction, validateBid };
