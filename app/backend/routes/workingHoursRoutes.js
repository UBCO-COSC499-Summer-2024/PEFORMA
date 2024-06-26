const express = require('express');
const router = express.Router();
const { getWorkingHours} = require('../controllers/workingHoursController'); // Adjust the path as necessary
router.get('/', getWorkingHours);

module.exports = router;
