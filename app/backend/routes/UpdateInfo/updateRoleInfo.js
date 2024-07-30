const express = require('express');
const router = express.Router();
const updateRoleInfoController = require('../../controllers/UpdateInfo/updateRoleInfoController');

router.post('/', updateRoleInfoController.updateRoleInfo)
module.exports = router;
