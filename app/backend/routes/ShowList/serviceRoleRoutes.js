const express = require('express');
const router = express.Router();
const serviceRoleController = require('../../controllers/ShowList/serviceRoleController');

router.get('/', serviceRoleController.getAllServiceRoles); 

module.exports = router; 
