const express = require('express');
const router = express.Router();
const teachingAssignment= require('../../controllers/ShowList/teachingAssignment');
router.get('/', teachingAssignment.getTeachingAssignment);

module.exports = router;
