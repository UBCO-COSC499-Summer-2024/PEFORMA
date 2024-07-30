const express = require('express');
const router = express.Router();
const workingHoursController = require('../controllers/Performance/workingHoursController'); // Adjust the path as necessary
router.get('/', workingHoursController.getWorkingHours);

module.exports = router;
