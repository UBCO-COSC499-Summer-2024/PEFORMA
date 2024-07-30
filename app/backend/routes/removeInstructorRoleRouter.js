const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/removeInstructorRoleController');

router.post('/', instructorController.removeInstructorRole);

module.exports = router;
