const express = require('express');
const router = express.Router();
const statusChangeServiceRoleController = require('../../controllers/UpdateStatus/statusChangeServiceRoleController');
router.post('/', statusChangeServiceRoleController.getStatusChangeServiceRole);

module.exports = router;
