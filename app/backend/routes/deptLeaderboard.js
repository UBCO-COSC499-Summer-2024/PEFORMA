const express = require('express');
const router = express.Router();
const deptLeaderBoardController = require('../controllers/Performance/deptLeaderBoardController'); // Adjust the path as necessary
router.get('/', deptLeaderBoardController.getDeptLeaderBoard);

module.exports = router;
