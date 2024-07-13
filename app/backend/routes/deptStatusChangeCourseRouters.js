const express = require('express');
const router = express.Router();
const { getStatusChangeCourse} = require('../controllers/statusChangeCourseController'); // Adjust the path as necessary
router.post('/', getStatusChangeCourse);

module.exports = router;
