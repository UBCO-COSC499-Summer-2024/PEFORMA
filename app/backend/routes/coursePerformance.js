const express = require('express');
const router = express.Router();
const coursePerformanceController = require('../controllers/coursePerformanceController'); // Adjust the path as necessary
router.get('/', coursePerformanceController.getCoursePerformance);

module.exports = router;
