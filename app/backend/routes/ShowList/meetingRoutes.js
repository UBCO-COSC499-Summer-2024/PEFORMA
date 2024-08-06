const express = require('express');
const meetingController = require('../../controllers/ShowList/meetingController');
const router = express.Router();

router.get('/', meetingController.getMeetings);

module.exports = router;