const express = require('express');
const router = express.Router();
const { getStatusChangeMembers } = require('../controllers/adminStatusChangeMembersController'); // Adjust the path as necessary
router.post('/', getStatusChangeMembers);

module.exports = router;