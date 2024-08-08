const teachingAssignment = require('../../services/ShowList/teachingAssignment');

async function getTeachingAssignment(req, res) {
  try {
    const teachingassignment = await teachingAssignment.getTeachingAssignment(); //Execute service
    res.json(teachingassignment);
  } catch (error) {
    console.error('Error fetching teaching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch teaching assignment' });
  }
}

module.exports = {
getTeachingAssignment
};
