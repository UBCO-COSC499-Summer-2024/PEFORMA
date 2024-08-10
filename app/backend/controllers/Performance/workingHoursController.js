const workingHoursService = require('../../services/Performance/workingHours');

async function getWorkingHours(req, res) {
  try {
    const workingHours = await workingHoursService.getWorkingHours(req); //Execute service
    res.send(workingHours);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch working hours' });
  }
}

module.exports = {
  getWorkingHours
};
