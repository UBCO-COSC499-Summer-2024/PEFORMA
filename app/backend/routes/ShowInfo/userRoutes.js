const express = require('express');
const router = express.Router();
const userController = require('../../controllers/ShowInfo/userController');

router.get('/user/:profileId', userController.getUserById);

module.exports = router;