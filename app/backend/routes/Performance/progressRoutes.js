const express = require('express');
const router = express.Router();
const progressController = require('../../controllers/Performance/progressController');
router.get('/', progressController.getProgress);

module.exports = router;
