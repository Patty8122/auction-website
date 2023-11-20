import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;
const app = express();
app.use(express.json());

app.get('/test', async (req, res) => {
    // Hit DB_URL/test endpoint
    const result = await fetch(`${DB_URL}test`);
    if (result.ok) {
        res.json({ message: `Success, got response from db-gateway!`});
    }
});

app.post('/auctions', async (req, res) => {
    const { itemId, startDateTime, endDateTime, startingPrice } = req.body;
    console.log(`Creating auction for item ${itemId}`)

    const auction = {
        itemId,
        startDateTime,
        endDateTime,
        startingPrice
    };

    const result = await fetch(`${DB_URL}auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auction)
    });

    if (result.ok) {
        console.log('Created auction');
        const data = await result.json();
        res.json(data);
    }
    else {
        res.status(500).send('Error');
    }
});

app.get('/auctions/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Getting auction ${id}`);
});


// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
