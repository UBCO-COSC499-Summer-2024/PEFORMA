const express = require('express');
const router = express.Router();
const { getUserPerformance } = require('../controllers/performanceController'); // Adjust the path as necessary
router.get('/', getUserPerformance);

module.exports = router;
