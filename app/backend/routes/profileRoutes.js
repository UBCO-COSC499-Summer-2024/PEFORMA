const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/profileController'); // Adjust the path as necessary
router.get('/', getUserProfile);

module.exports = router;
