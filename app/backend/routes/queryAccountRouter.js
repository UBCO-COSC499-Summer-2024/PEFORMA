const express = require('express');
const router = express.Router();
const queryAccountController = require('../controllers/Login/queryAccountController'); // Adjust the path as necessary
router.get('/', queryAccountController.queryAccount);
  
module.exports = router;
  
