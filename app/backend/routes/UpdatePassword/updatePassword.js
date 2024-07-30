const express = require('express');
const router = express.Router();
const updatePasswordController = require('../../controllers/UpdatePassword/updatePasswordController.js');

router.post('/', updatePasswordController.updatePassword)
module.exports = router;
