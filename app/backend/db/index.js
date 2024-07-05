require('dotenv').config();  // Load environment variables

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,  
});

async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Database connected successfully.');
    } catch (err) {
        console.log('Database connection error', err.stack);
    }
}
  
  module.exports = pool;
