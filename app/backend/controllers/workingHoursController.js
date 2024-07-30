const workingHoursService = require('../services/Performance/workingHours');

async function getWorkingHours(req, res) {
  try {
    const workingHours = await workingHoursService.getWorkingHours(req);
    res.send(workingHours);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
}

module.exports = {
  getWorkingHours
};
