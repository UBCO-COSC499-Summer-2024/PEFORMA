const teachingAssignment = require('../../services/ShowList/teachingAssignment');

async function getTeachingAssignment(req, res) {
  try {
    const teachingassignment = await teachingAssignment.getTeachingAssignment();
    res.json(teachingassignment);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

module.exports = {
getTeachingAssignment
};
