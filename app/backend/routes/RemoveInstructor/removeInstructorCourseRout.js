const express = require('express');
const router = express.Router();
const instructorController = require('../../controllers/RemoveInstructor/removeInstructorCourseController');

router.post('/', instructorController.removeInstructorCourse);

module.exports = router;
