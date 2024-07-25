const express = require('express');
const router = express.Router();
const { setCurrentTerm } = require('../controllers/setCurrentTermController');

router.post('/setCurrentTerm', setCurrentTerm);

module.exports = router;