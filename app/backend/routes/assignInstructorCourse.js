const express = require('express');
const router = express.Router();
const assignCourseController = require('../controllers/assignCourseController');
router.post('/', assignCourseController.assignCourse);

module.exports = router;
