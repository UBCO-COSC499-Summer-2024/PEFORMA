const express = require('express');
const router = express.Router();
const setCurrentTermController = require('../controllers/setCurrentTermController');

router.post('/', setCurrentTermController.setCurrentTerm);

module.exports = router;