const express = require('express');
const router = express.Router();
const accountTypeController = require('../../controllers/Login/accountTypeController');

router.get('/:accountId', accountTypeController.queryAccountType); // Fetch all courses

module.exports = router;
