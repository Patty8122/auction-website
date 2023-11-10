import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
	res.send('Test endpoint reached!');
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
