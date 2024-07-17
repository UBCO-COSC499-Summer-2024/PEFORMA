const roleInfo = require('../services/roleInfo');

async function getServiceInfo(req, res) {
  try {
    const roleinfo = await roleInfo.getServiceInfo(req);
    res.json(roleinfo);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

module.exports = {
  getServiceInfo
};