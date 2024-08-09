const deptPerformanceService = require('../../services/Performance/deptPerformance');

async function getDepartPerformance(req, res) {
  try {
    const deptPerformance = await deptPerformanceService.getDepartPerformance();//Execute service
    res.send(deptPerformance);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department peformance' });
  }
}

module.exports = {
    getDepartPerformance
};
