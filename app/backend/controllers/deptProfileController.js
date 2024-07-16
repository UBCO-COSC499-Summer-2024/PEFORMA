const deptProfileService = require('../services/deptProfileService');

class DeptProfileController {
    async updateBenchmark(req, res) {
        try {
            const { ubcId, benchmark } = req.body;
            const updatedProfile = await deptProfileService.updateBenchmark(ubcId, benchmark);
            res.json(updatedProfile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateServiceRoles(req, res) {
        try {
            const { ubcId, serviceRoles } = req.body;
            await deptProfileService.updateServiceRoles(ubcId, serviceRoles);
            res.json({ message: 'Service roles updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCourseAssignments(req, res) {
        try {
            const { ubcId, courses } = req.body;
            await deptProfileService.updateCourseAssignments(ubcId, courses);
            res.json({ message: 'Course assignments updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DeptProfileController();