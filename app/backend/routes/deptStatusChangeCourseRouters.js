const express = require('express');
const router = express.Router();
const statusChangeCourseController = require('../controllers/statusChangeCourseController'); // Adjust the path as necessary
router.post('/', statusChangeCourseController.getStatusChangeCourse);

module.exports = router;
