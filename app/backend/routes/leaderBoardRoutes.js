const express = require('express');
const router = express.Router();
const leaderBoardController = require('../controllers/Performance/leaderBoardController'); // Adjust the path as necessary
router.get('/', leaderBoardController.getLeaderBoard);

module.exports = router;
