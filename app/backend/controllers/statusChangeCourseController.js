const statusChangeCourseService = require('../services/statusChangeCourse');

async function getStatusChangeCourse(req, res) {
  try {
    const statusChange = await statusChangeCourseService.getStatusChangeCourse(req);
    res.json(statusChange);
  } catch (error) {
    console.error('Error updating status courses:', error);
    res.status(500).json({ error: 'Failed to upload course evaluation' });
  }
}

module.exports = {
  getStatusChangeCourse
};