const express = require('express');
const pool = require('../config/db.js'); 
const router = express.Router();
const port = process.env.PORT || 3001;  // Default to 3001 if environment variable not set

router.use(express.json());
// Test database connection
//testDB();

// Route to handle the root URL
router.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

// Example route to fetch all profiles from a 'Profile' table
router.post('/profiles', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM public."Profile"');
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;