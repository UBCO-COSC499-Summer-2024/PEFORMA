const express = require('express');
const router = express.Router();
const assignServiceRoleController= require('../../controllers/AssignInstructor/assignInstructorServiceRoleController');
router.post('/', assignServiceRoleController.assignServiceRole);

module.exports = router;
