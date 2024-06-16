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

// Mount profile routes under '/api/instructorProfile'
app.use('/api/instructorProfile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log error information for debugging
    res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
