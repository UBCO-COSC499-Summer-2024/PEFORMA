// const express = require('express');
// const { Client } = require('pg');
// require('dotenv').config();

// const app = express();
// const port = 3001;

// const client = new Client({
//   user: process.env.POSTGRES_USER,
//   host: process.env.DB_HOST,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
//   port: process.env.DB_PORT,
// });

// client.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('Connection error', err.stack));

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Backend server running at http://localhost:${port}`);
// });
