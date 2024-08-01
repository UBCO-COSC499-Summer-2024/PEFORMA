const allInstructorsService = require('../../services/ShowList/allInstructorsService');

async function getAllInstructors(req, res) {
  try {
    const members = await allInstructorsService.getAllInstructors();
    res.json(members);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

module.exports = {
  getAllInstructors
};