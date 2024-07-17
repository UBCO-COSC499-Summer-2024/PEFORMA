const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/:id', imageController.getImageById);

module.exports = router;