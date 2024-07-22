const express = require('express');
const router = express.Router();
const allTermsController= require('../controllers/allTermsController'); // Adjust the path as necessary
router.get('/', allTermsController.getAllTerms);

module.exports = router;
