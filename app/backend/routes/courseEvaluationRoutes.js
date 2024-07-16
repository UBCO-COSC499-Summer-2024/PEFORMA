const express = require('express');
const router = express.Router();
const courseEvaluationController = require('../controllers/courseEvaluation');

router.post('/', courseEvaluationController.getCourseEvaluation); // Fetch all courses

module.exports = router;
