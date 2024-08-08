const coursePerformanceService = require('../../services/Performance/coursePerformance');

async function getCoursePerformance(req, res) {
  try {
    const coursePerformance = await coursePerformanceService.getCoursePerformance(req);//Execute service
    res.send(coursePerformance);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
}

module.exports = {
    getCoursePerformance
};
