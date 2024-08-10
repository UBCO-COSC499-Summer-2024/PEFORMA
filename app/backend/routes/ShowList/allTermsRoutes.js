const express = require('express');
const router = express.Router();
const allTermsController= require('../../controllers/ShowList/allTermsController');
router.get('/', allTermsController.getAllTerms);

module.exports = router;
