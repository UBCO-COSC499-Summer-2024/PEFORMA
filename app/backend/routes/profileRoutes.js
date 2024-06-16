const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/profileController'); // Adjust the path as necessary

// Define the route for getting a user profile by ID
router.get('/:id', async (req, res, next) => {
    try {
        await getUserProfile(req, res);
    } catch (error) {
        next(error); // Forward to error handling middleware
    }
});

module.exports = router;
