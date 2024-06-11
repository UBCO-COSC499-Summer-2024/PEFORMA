const express = require('express');
const { pool, testDB } = require('./db/index.js'); 
const app = express();
const port = 3000;

app.use(express.json());

// Test database connection
testDB();

// Route to handle the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

// Example route to fetch all profiles from a 'Profile' table
app.get('/profiles', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM public."Profile"');
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
