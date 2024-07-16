const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController.js');

router.get('/', courseController.getCourses);

module.exports = router; 
