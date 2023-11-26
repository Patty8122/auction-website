import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DB_URL
});

export const query = (text, params) => pool.query(text, params);
