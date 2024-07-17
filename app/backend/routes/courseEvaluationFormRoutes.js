const express = require('express');
const router = express.Router();
const courseEvaluationFormController = require('../controllers/courseEvaluationForm');

router.get('/', courseEvaluationFormController.getCourseInformation); // Fetch all courses

module.exports = router;
