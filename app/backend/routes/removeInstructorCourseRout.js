const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/removeInstructorCourseController');

router.post('/removeInstructorCourse', instructorController.removeInstructorCourse);

module.exports = router;
