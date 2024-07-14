const express = require('express');
const router = express.Router();
const assignInstructorController = require('../controllers/assignRole'); // Adjust the path as necessary
router.get('/', assignInstructorController.assignInstructor);

module.exports = router;
