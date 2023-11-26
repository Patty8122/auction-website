import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { query } from './db.js';
import { validateAuction, validateBid } from './validate.js';
import { fetchAuctionData } from './auctionMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.json());

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Auction API',
        version: '1.0.0',
        description: 'API for managing auctions',
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: 'Development server',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['src/server.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test Endpoint
 *     description: Returns a success message to indicate the auction service is running.
 *     tags:
 *       - Test
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully hit auction-service
 */
app.get('/test', (req, res) => {
    res.json({ message: `Successfully hit auction-service` });
});

/**
 * @swagger
 * /auctions:
 *   post:
 *     summary: Create a new auction
 *     description: Create a new auction with the given details.
 *     tags:
 *      - Auctions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - startDateTime
 *               - endDateTime
 *               - startingPrice
 *               - sellerId
 *               - bidIncrement
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: The ID of the item
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the auction
 *               endDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: The end time of the auction
 *               startingPrice:
 *                 type: number
 *                 description: The starting price of the auction
 *               sellerId:
 *                 type: integer
 *                 description: The ID of the seller
 *               bidIncrement:
 *                 type: number
 *                 description: The minimum increment for each bid
 *     responses:
 *       201:
 *         description: Auction created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
app.post('/auctions', validateAuction, async (req, res) => {
    const { itemId, startDateTime, endDateTime, startingPrice, sellerId, bidIncrement } = req.body;
    const initialStatus = 'pending';

    try {
        const result = await query(
            'INSERT INTO auctions (item_id, seller_id, start_time, end_time, starting_price, status, current_bid, bid_increment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [itemId, sellerId, startDateTime, endDateTime, startingPrice, initialStatus, startingPrice, bidIncrement]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating auction:', error);
        res.status(500).send('Error creating auction');
    }
});

/**
 * @swagger
 * /auctions:
 *   get:
 *     summary: Retrieve all auctions
 *     description: Fetches details of all auctions.
 *     tags:
 *      - Auctions
 *     responses:
 *       200:
 *         description: List of all auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the auction.
 *                   item_id:
 *                     type: integer
 *                     description: The ID of the item being auctioned.
 *                   seller_id:
 *                     type: integer
 *                     description: The ID of the seller.
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                     description: The start time of the auction.
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                     description: The end time of the auction.
 *                   starting_price:
 *                     type: number
 *                     description: The starting price of the auction.
 *                   status:
 *                     type: string
 *                     description: The current status of the auction.
 *       500:
 *         description: Server error.
 */
app.get('/auctions', async (req, res) => {
    try {
        const result = await query('SELECT * FROM auctions');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving auctions:', error);
        res.status(500).send('Error retrieving auctions');
    }
});

/**
 * @swagger
 * /auctions/{id}:
 *   get:
 *     summary: Retrieve a specific auction
 *     description: Fetches details of a specific auction by its ID.
 *     tags:
 *       - Auctions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the auction to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Auction data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the auction.
 *                 item_id:
 *                   type: integer
 *                   description: The ID of the item being auctioned.
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start time of the auction.
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end time of the auction.
 *                 starting_price:
 *                   type: number
 *                   description: The starting price of the auction.
 *                 status:
 *                   type: string
 *                   description: The current status of the auction.
 *       404:
 *         description: Auction not found.
 *       500:
 *         description: Server error.
 */
app.get('/auctions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query('SELECT * FROM auctions WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Auction not found');
        }
    } catch (error) {
        console.error('Error retrieving auction:', error);
        res.status(500).send('Error retrieving auction');
    }
});

/**
 * @swagger
 * /auctions/{id}/bids:
 *   post:
 *     summary: Place a bid on an auction
 *     description: Allows a user to place a bid on an auction if it is active.
 *     tags:
 *       - Bids
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the auction
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bidAmount
 *               - userId
 *             properties:
 *               bidAmount:
 *                 type: number
 *                 description: The amount of the bid
 *               userId:
 *                 type: integer
 *                 description: The ID of the user placing the bid
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Auction is not active or bid is invalid
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Server error
 */
app.post('/auctions/:id/bids', fetchAuctionData, validateBid, async (req, res) => {
    const auctionId = req.params.id;
    const { bidAmount, userId } = req.body;
    const currentTime = new Date();

    try {
        // Insert the bid and update the current bid in the auctions table
        const bidResult = await query(
            'INSERT INTO bids (auction_id, user_id, bid_amount, bid_time) VALUES ($1, $2, $3, $4) RETURNING *',
            [auctionId, userId, bidAmount, currentTime]
        );
        await query('UPDATE auctions SET current_bid = $1 WHERE id = $2', [bidAmount, auctionId]);

        res.status(200).json(bidResult.rows[0]);
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).send('Error placing bid');
    }
});

/**
 * @swagger
 * /auctions/{id}/bids:
 *   get:
 *     summary: Get all bids for an auction
 *     description: Retrieves a list of all bids placed on a specific auction, ordered by bid time.
 *     tags:
 *       - Bids
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the auction
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of bids
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Bid ID
 *                   auction_id:
 *                     type: integer
 *                     description: Auction ID
 *                   user_id:
 *                     type: integer
 *                     description: User ID of the bidder
 *                   bid_amount:
 *                     type: number
 *                     description: Amount of the bid
 *                   bid_time:
 *                     type: string
 *                     format: date-time
 *                     description: Time when the bid was placed
 *       404:
 *         description: Auction not found
 *       500:
 *         description: Server error
 */
app.get('/auctions/:id/bids', async (req, res) => {
    const auctionId = req.params.id;

    try {
        const bidsResult = await query('SELECT * FROM bids WHERE auction_id = $1 ORDER BY bid_time', [auctionId]);

        if (bidsResult.rows.length === 0) {
            return res.status(404).send('No bids found for this auction');
        }

        res.json(bidsResult.rows);
    } catch (error) {
        console.error('Error retrieving bids:', error);
        res.status(500).send('Error retrieving bids');
    }
});

/**
 * @swagger
 * /auctions/{id}/current-bid:
 *   get:
 *     summary: Get the current highest bid for an auction
 *     description: Retrieve the current highest bid for a specified auction.
 *     tags:
 *       - Bids
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the auction
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current highest bid retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller_id:
 *                   type: number
 *                   description: The ID of the user who placed the current highest bid.
 *                 current_bid:
 *                   type: number
 *                   description: The current highest bid amount.
 *       404:
 *         description: Auction not found.
 */
app.get('/auctions/:id/current-bid', async (req, res) => {
    const auctionId = req.params.id;

    try {
        const result = await query('SELECT seller_id, current_bid FROM auctions WHERE id = $1', [auctionId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Auction not found');
        }

        const auction = result.rows[0];
        res.status(200).json({ 
            seller_id: auction.seller_id,
            current_bid: auction.current_bid 
        });
    } catch (error) {
        console.error('Error fetching current bid:', error);
        res.status(500).send('Error fetching current bid');
    }
});

/**
 * @swagger
 * /auctions/{id}/final-bid:
 *   get:
 *     summary: Get the final bid of an auction
 *     description: Retrieve the final winning bid for a specified auction, but only if the auction is over.
 *     tags:
 *       - Bids
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the auction
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Final bid retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller_id:
 *                   type: number
 *                   description: The ID of the user who placed the final winning bid.
 *                 final_bid:
 *                   type: number
 *                   description: The final winning bid amount.
 *       400:
 *         description: Auction is still active.
 *       404:
 *         description: Auction not found.
 */
app.get('/auctions/:id/final-bid', async (req, res) => {
    const auctionId = req.params.id;

    try {
        const result = await query('SELECT seller_id, current_bid, end_time FROM auctions WHERE id = $1', [auctionId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Auction not found');
        }

        const auction = result.rows[0];
        if (new Date() < new Date(auction.end_time)) {
            return res.status(400).send('Auction is still active');
        }

        res.status(200).json({
            seller_id: auction.seller_id,
            final_bid: auction.current_bid
        });
    } catch (error) {
        console.error('Error fetching final bid:', error);
        res.status(500).send('Error fetching final bid');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
