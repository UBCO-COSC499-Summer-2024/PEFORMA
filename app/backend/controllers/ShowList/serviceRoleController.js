const serviceRoleService = require('../../services/ShowList/serviceRoleService');

async function getAllServiceRoles(req, res) {
  try {
    const serviceRoles = await serviceRoleService.getAllServiceRoles(); 
    res.json(serviceRoles);
  } catch (error) {
    console.error('Error fetching service roles:', error);
    res.status(500).json({ error: 'Failed to fetch service roles' });
  }
}

module.exports = {
  getAllServiceRoles
};
