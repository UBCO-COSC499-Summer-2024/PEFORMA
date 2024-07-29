const express = require('express');
const router = express.Router();
const updateCourseInfoController = require('../controllers/updateCourseInfoController.js');
router.post('/', updateCourseInfoController.updateCourseInfo);

module.exports = router;