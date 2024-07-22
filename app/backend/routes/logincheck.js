const express = require('express');
const router = express.Router();
const loginCheckController = require('../controllers/loginCheckController.js');

router.post('/', loginCheckController.loginCheck);

module.exports = router; 
