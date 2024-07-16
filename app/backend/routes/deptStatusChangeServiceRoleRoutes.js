const express = require('express');
const router = express.Router();
const statusChangeServiceRoleController = require('../controllers/statusChangeServiceRoleController'); // Adjust the path as necessary
router.post('/', statusChangeServiceRoleController.getStatusChangeServiceRole);

module.exports = router;
