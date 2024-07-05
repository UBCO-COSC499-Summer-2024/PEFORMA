const express = require('express');
const router = express.Router();
const allCoursesController = require('../controllers/allCoursesController');

router.get('/', allCoursesController.getAllCourses); // Fetch all courses

module.exports = router;
