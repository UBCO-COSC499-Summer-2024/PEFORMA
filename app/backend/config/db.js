require('dotenv').config();  // Load environment variables

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,  
});

// Function to test the database connection
const testDB = async () => {
    try {
        await pool.query('SELECT NOW()'); // query to test the connection
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

module.exports = { pool, testDB };
