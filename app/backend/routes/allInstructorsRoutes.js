const express = require('express');
const router = express.Router();
const { getAllInstructors } = require('../controllers/allInstructorsController'); // Adjust the path as necessary
router.get('/', getAllInstructors);

module.exports = router;
