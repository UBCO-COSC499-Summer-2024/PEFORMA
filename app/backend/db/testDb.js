require('dotenv').config();  // Load environment variables

const { Pool } = require('pg');

const testPool = new Pool({
  user: process.env.POSTGRES_USER || 'capstone',
  host: process.env.TEST_DB_HOST || '192.168.0.3',  // Use service name
  database: process.env.POSTGRES_DB || 'capstone_test',
  password: process.env.POSTGRES_PASSWORD || 'teamsix',
  port: process.env.TEST_DB_PORT || 5432, // The internal port of the PostgreSQL container
});

testPool.connect((err) => {
    if (err) {
      console.error('Test database connection error', err.stack);
    } else {
      console.log('Test database connected successfully.');
    }
  });

module.exports = testPool;
