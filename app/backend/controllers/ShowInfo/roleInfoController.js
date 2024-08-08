const roleInfo = require('../../services/ShowInfo/roleInfo');

async function getServiceInfo(req, res) {
  try {
    const roleinfo = await roleInfo.getServiceInfo(req); //Execute service
    res.json(roleinfo);
  } catch (error) {
    console.error('Error fetching service info:', error);
    res.status(500).json({ error: 'Failed to fetch service info' });
  }
}

module.exports = {
  getServiceInfo
};