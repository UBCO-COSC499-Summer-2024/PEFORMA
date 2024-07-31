const express = require('express');
const router = express.Router();
const updateCourseInfoController = require('../../controllers/UpdateInfo/updateCourseInfoController.js');
router.post('/', updateCourseInfoController.updateCourseInfo);

module.exports = router;