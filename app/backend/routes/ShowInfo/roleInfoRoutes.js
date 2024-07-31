const express = require('express');
const router = express.Router();
const getRoleInfo = require('../../controllers/ShowInfo/roleInfoController'); 
router.get('/', getRoleInfo.getServiceInfo);

module.exports = router;