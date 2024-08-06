const deptProfileService = require('../../services/UpdateInfo/deptProfileService');

class DeptProfileController {
    async updateBenchmark(req, res) {
        try {
            const { ubcId, benchmark } = req.body;
            const updatedProfile = await deptProfileService.updateBenchmark(ubcId, benchmark);
            res.json(updatedProfile);
        } catch (error) {
            console.error('Error in updateBenchmark:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateServiceRoles(req, res) {
        try {
            const { ubcId, serviceRoles } = req.body;
            console.log('Received request:', { ubcId, serviceRoles }); // Log the received data
            await deptProfileService.updateServiceRoles(ubcId, serviceRoles);
            res.json({ message: 'Service roles updated successfully' });
        } catch (error) {
            console.error('Error in updateServiceRoles:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateCourseAssignments(req, res) {
        try {
            const { ubcId, courses } = req.body;
            console.log('Received request:', { ubcId, courses }); // Log the received data
            await deptProfileService.updateCourseAssignments(ubcId, courses);
            res.json({ message: 'Course assignments updated successfully' });
        } catch (error) {
            console.error('Error in updateCourseAssignments:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DeptProfileController();