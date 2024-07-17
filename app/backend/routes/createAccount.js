const express = require('express');
const router = express.Router();
const createAccount = require('../controllers/createAccount.js');

router.post('/', createAccount.createAccount);

module.exports = router; 
