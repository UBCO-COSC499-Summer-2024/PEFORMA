const express = require('express');
const router = express.Router();
const deptProfileController = require('../../controllers/UpdateInfo/deptProfileController');

router.put('/benchmark', deptProfileController.updateBenchmark);
router.put('/service-roles', deptProfileController.updateServiceRoles);
router.put('/course-assignments', deptProfileController.updateCourseAssignments);

module.exports = router;

