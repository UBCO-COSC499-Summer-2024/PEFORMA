const allInstructorsService = require('../../services/ShowList/allInstructorsService');

async function getAllInstructors(req, res) {
  try {
    const members = await allInstructorsService.getAllInstructors(); //Execute service
    res.json(members);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
}

module.exports = {
  getAllInstructors
};