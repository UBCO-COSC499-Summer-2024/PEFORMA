const express = require('express');
const router = express.Router();
const assignCourseController = require('../../controllers/AssignInstructor/assignCourseController');
router.post('/', assignCourseController.assignCourse);

module.exports = router;
