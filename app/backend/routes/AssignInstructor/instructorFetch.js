const express = require('express');
const router = express.Router();
const authenticate = require("../../Manager/authenticate")
const instructorFetchController = require('../../controllers/AssignInstructor/instructorFetchController');
router.get('/', authenticate, instructorFetchController.instructorFetch);
 
module.exports = router;
