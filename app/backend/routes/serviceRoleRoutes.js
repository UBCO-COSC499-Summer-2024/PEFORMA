const express = require('express');
const router = express.Router();
const serviceRoleController = require('../controllers/serviceRoleController');

router.get('/', serviceRoleController.getAllServiceRoles); // Fetch all service roles

module.exports = router; 
