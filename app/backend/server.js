const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes'); // Ensure the path is correct based on your directory structure
//const { pool, testDB } = require('./db/index.js');
const app = express();
const port = process.env.PORT || 3001; // Default to 3001 if environment variable not set

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Middleware for parsing JSON bodies

//testDB();
// Base route for simple health check
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
app.get('/instructor/profile/:profileId', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW()');
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
