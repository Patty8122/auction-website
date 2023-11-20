import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const auctionPool = new Pool({
	database: process.env.AUCTION_DB,
});

const queryAuction = (text, params) => auctionPool.query(text, params);

const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
	// Return a test message
	res.json({ message: 'Hello from db-gateway-service!' });
});

app.post('/auctions', (req, res) => {
	const { itemId, startDateTime, endDateTime, startingPrice } = req.body;

	const auction = {
		itemId,
		startDateTime,
		endDateTime,
		startingPrice,
	};

	queryAuction(
		'INSERT INTO auctions (item_id, start_time, end_time, starting_price) VALUES ($1, $2, $3, $4) RETURNING *',
		[itemId, startDateTime, endDateTime, startingPrice]
	)
		.then((result) => {
			res.json(result.rows[0]);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error');
		});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
