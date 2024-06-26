const express = require('express');
const router = express.Router();
const { getDepartPerformance } = require('../controllers/deptPerformanceController'); // Adjust the path as necessary
router.get('/', getDepartPerformance);

module.exports = router;
