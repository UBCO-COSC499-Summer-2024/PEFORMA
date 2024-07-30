const express = require('express');
const router = express.Router();
const updatePasswordController = require('../controllers/updatePasswordController.js');

router.post('/', updatePasswordController.updatePassword)
module.exports = router;
