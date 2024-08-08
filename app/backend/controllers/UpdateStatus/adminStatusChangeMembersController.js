const adminStatusChangeService = require('../../services/UpdateStatus/adminStatusChange');

async function StatusChangeMembers(req, res) {
  try {
    const statusChange = await adminStatusChangeService.StatusChangeMembers(req); //Execute service
    res.json(statusChange);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    }
    else{
      res.status(500).json({ error: 'Failed to update status' });
    }
    
  }
}

module.exports = {
  StatusChangeMembers
};