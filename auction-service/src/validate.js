import moment from 'moment';

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

const validateBid = (req, res, next) => {
    const { bidAmount } = req.body;
    const { start_time, end_time, status, current_bid, bid_increment } = req.auctionDetails;
    const currentTime = moment();

    if (!currentTime.isBetween(moment(start_time), moment(end_time))) {
        return res.status(400).send('Auction is not active');
    }

    const numericCurrentBid = parseFloat(current_bid);
    const numericBidIncrement = parseFloat(bid_increment);

    if (bidAmount <= numericCurrentBid || bidAmount < numericCurrentBid + numericBidIncrement) {
        return res.status(400).send(`Bid must be higher than the current bid by at least $${numericBidIncrement}`);
    }

    next();
};


export { validateAuction, validateBid };
