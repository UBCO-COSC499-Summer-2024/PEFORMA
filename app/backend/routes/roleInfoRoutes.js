const express = require('express');
const router = express.Router();
const getRoleInfo = require('../controllers/roleInfoController'); // Adjust the path as necessary
router.get('/', getRoleInfo.getServiceInfo);

module.exports = router;
