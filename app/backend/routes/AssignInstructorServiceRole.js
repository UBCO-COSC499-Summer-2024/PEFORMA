const express = require('express');
const router = express.Router();
const assignServiceRoleController= require('../controllers/assignInstructorServiceRoleController');
router.post('/', assignServiceRoleController.assignServiceRole);

module.exports = router;
