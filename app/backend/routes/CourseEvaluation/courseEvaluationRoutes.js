const express = require('express');
const router = express.Router();
const courseEvaluationController = require('../../controllers/CourseEvaluation/courseEvaluation');

router.post('/', courseEvaluationController.getCourseEvaluation);

module.exports = router;
