const express = require('express');
const router = express.Router();
const { getCoursePerformance } = require('../controllers/coursePerformanceController'); // Adjust the path as necessary
router.get('/', getCoursePerformance);

module.exports = router;
