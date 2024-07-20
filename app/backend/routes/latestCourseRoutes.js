const express = require('express');
const router = express.Router();
const courseController = require('../controllers/latestCourseController.js');

router.get('/latestCourseTerm', courseController.getLatestCourseTerm);

module.exports = router;
