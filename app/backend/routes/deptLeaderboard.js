const express = require('express');
const router = express.Router();
const { getDeptLeaderBoard } = require('../controllers/deptLeaderBoardController'); // Adjust the path as necessary
router.get('/', getDeptLeaderBoard);

module.exports = router;
