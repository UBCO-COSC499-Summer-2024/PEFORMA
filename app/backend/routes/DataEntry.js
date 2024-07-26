const express = require('express');
const router = express.Router();
const dataEntryController = require('../controllers/dataEntryController');

router.post('/', dataEntryController.saveDataToDatabase);

module.exports = router; 
