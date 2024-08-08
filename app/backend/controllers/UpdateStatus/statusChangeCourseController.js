const statusChangeCourseService = require('../../services/UpdateStatus/statusChangeCourse');

async function getStatusChangeCourse(req, res) {
  try {
    const statusChange = await statusChangeCourseService.getStatusChangeCourse(req);//Execute service
    res.json(statusChange);
  } catch (error) {
    console.error('Error updating status courses:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
}

module.exports = {
  getStatusChangeCourse
};