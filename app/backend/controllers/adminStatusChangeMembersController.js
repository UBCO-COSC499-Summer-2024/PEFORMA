const adminStatusChangeService = require('../services/adminStatusChange');

async function StatusChangeMembers(req, res) {
  try {
    const statusChange = await adminStatusChangeService.StatusChangeMembers(req);
    res.json(statusChange);
  } catch (error) {
    console.error('Error uploading course evaluation:', error);
    res.status(500).json({ error: 'Failed to upload course evaluation' });
  }
}

module.exports = {
  StatusChangeMembers
};