const express = require('express');
const router = express.Router();
const { getCourseHistory } = require('../controllers/courseHistoryController'); // Adjust the path as necessary
router.get('/', getCourseHistory);

module.exports = router;
