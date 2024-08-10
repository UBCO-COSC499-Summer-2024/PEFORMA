const express = require('express');
const userProfileGetController = require('../../controllers/ShowInfo/userProfileGetController');

const router = express.Router();

router.get('/:profileId', userProfileGetController.getUserProfile);

module.exports = router;