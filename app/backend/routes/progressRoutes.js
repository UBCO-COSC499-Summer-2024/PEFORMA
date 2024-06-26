const express = require('express');
const router = express.Router();
const { getProgress } = require('../controllers/progressController'); // Adjust the path as necessary
router.get('/', getProgress);

module.exports = router;
