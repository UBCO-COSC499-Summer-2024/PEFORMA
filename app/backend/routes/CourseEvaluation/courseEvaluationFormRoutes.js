const express = require('express');
const router = express.Router();
const courseEvaluationFormController = require('../../controllers/CourseEvaluation/courseEvaluationForm');

router.get('/', courseEvaluationFormController.getCourseInformation); // Fetch all courses

module.exports = router;
