import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
	res.send('Auction service reached!');
});

app.post('/auctions', async (req, res) => {
    const { itemId, startDateTime, endDateTime, startingPrice } = req.body;

    try {
        //const result = await query('INSERT INTO auctions (item_id, start_date_time, end_date_time, starting_price) VALUES ($1, $2, $3, $4) RETURNING *', [itemId, startDateTime, endDateTime, startingPrice]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/auctions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        //const result = await query('SELECT * FROM auctions WHERE auction_id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
