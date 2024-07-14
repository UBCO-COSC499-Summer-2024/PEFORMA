const express = require('express');
const router = express.Router();
const { getStatusChangeServiceRole } = require('../controllers/statusChangeServiceRoleController'); // Adjust the path as necessary
router.post('/', getStatusChangeServiceRole);

module.exports = router;
