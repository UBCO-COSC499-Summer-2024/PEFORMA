const express = require('express');
const router = express.Router();
const workingHoursController = require('../controllers/workingHoursController'); // Adjust the path as necessary
router.get('/', workingHoursController.getWorkingHours);

module.exports = router;
