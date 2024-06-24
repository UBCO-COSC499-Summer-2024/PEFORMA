const express = require('express');
const router = express.Router();
const { getLeaderBoard } = require('../controllers/leaderBoardController'); // Adjust the path as necessary
router.get('/', getLeaderBoard);

module.exports = router;
