const express = require('express');
const router = express.Router();
const teachingAssignment= require('../controllers/teachingAssignment'); // Adjust the path as necessary
router.get('/', teachingAssignment.getTeachingAssignment);

module.exports = router;
