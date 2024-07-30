const express = require('express');
const router = express.Router();
const loginCheckController = require('../controllers/Login/loginCheckController.js');

router.post('/', loginCheckController.loginCheck);

module.exports = router; 
