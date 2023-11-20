import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool();
const query = (text, params) => pool.query(text, params);

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
	res.send('db service reached!');
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
