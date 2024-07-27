const express = require('express');
const router = express.Router();
const decryptEmailController = require('../controllers/decryptEmailController.js');

router.post('/', decryptEmailController.decryptEmail);

module.exports = router; 
