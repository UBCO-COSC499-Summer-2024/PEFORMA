const express = require('express');
const router = express.Router();
const deptPerformanceController = require('../controllers/deptPerformanceController'); // Adjust the path as necessary
router.get('/', deptPerformanceController.getDepartPerformance);

module.exports = router;
