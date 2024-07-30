const express = require('express');
const router = express.Router();
const { getCourseHistory } = require('../../controllers/ShowInfo/courseHistoryController');
router.get('/', getCourseHistory);

module.exports = router;
