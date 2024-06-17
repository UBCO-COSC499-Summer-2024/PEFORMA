require('dotenv').config();  // Load environment variables

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,  // Use default port if not specified
});
console.log(pool);

pool.connect((err) => {
    if (err) {
      console.error('Database connection error', err.stack);
    } else {
      console.log('Database connected successfully.');
    }
}

module.exports = { pool,testDB };
