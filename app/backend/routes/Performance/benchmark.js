const express = require('express');
const router = express.Router();
const benchmarkController = require('../../controllers/Performance/benchmarkController'); // Adjust the path as necessary
router.get('/', benchmarkController.getBenchmark);

module.exports = router;
