const express = require('express');
const router = express.Router();
const updatePasswordController = require('../../controllers/Password/updatePasswordController.js');

router.post('/', updatePasswordController.updatePassword)
module.exports = router;
