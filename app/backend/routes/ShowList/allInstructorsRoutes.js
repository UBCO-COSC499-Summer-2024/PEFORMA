const express = require('express');
const router = express.Router();
const allInstructors= require('../../controllers/ShowList/allInstructorsController'); // Adjust the path as necessary
router.get('/', allInstructors.getAllInstructors);

module.exports = router;
