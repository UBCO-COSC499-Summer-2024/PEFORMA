const coursePerformanceService = require('../services/coursePerformance');

async function getCoursePerformance(req, res) {
  try {
    const coursePerformance = await coursePerformanceService.getCoursePerformance(req);
    res.send(coursePerformance);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
}

module.exports = {
    getCoursePerformance
};
