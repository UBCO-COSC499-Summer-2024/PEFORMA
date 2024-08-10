const statusChangeServiceRoleService = require('../../services/UpdateStatus/statusChangeServiceRole');

async function getStatusChangeServiceRole(req, res) {
  try {
    const statusChange = await statusChangeServiceRoleService.getStatusChangeServiceRole(req); //Execute service
    res.json(statusChange);
  } catch (error) {
    console.error('Error updating status courses:', error);
    res.status(500).json({ error: 'Failed to update status course' });
  }
}

module.exports = {
    getStatusChangeServiceRole
};