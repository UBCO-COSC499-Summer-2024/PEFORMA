const express = require('express');
const router = express.Router();
const getRoleInfo = require('../controllers/roleInfoController'); 
router.get('/', getRoleInfo.getServiceInfo);

module.exports = router;