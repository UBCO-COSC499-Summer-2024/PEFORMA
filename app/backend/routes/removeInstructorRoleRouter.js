// routes/removeInstructorRoleRouter.js
const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/removeInstructorRoleController');

router.post('/removeInstructorRole', instructorController.removeInstructorRole);

module.exports = router;
