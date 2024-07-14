const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/user/:profileId', userController.getUserById);

module.exports = router;