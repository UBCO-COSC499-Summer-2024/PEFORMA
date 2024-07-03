const express = require('express');
const router = express.Router();
const { getBenchmark } = require('../controllers/benchmarkController'); // Adjust the path as necessary
router.get('/', getBenchmark);

module.exports = router;
