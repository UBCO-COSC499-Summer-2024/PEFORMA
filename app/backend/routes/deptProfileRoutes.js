const express = require('express');
const router = express.Router();
const deptProfileController = require('../controllers/deptProfileController');

router.put('/benchmark', deptProfileController.updateBenchmark);
router.put('/service-roles', async (req, res) => {
    try {
        const { ubcId, serviceRoles } = req.body;
        console.log('Received request:', { ubcId, serviceRoles }); // Log the received data
        
        await deptProfileService.updateServiceRoles(ubcId, serviceRoles);
        
        res.json({ message: 'Service roles updated successfully' });
    } catch (error) {
        console.error('Error in service roles update:', error); // Log the full error
        res.status(500).json({ error: error.message });
    }
});
router.put('/course-assignments', deptProfileController.updateCourseAssignments);

module.exports = router;