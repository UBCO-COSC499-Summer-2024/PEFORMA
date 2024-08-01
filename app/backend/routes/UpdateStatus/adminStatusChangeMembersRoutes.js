const express = require('express');
const router = express.Router();
const statusChangeMembersController = require('../../controllers/UpdateStatus/adminStatusChangeMembersController'); // Adjust the path as necessary
router.post('/', statusChangeMembersController.StatusChangeMembers);

module.exports = router;