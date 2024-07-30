const express = require('express');
const router = express.Router();
const changePasswordController = require('../../controllers/Password/changePasswordController');

router.post('/:profileId', changePasswordController.changePassword);

module.exports = router;