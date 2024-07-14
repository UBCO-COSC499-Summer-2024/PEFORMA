const assignInstructorService = require('../services/assignRole');

async function assignInstructor(req, res) {
  try {
    const assign = await assignInstructorService.assignInstructor(req);
    res.json(assign);
  } catch (error) {
    console.error('Error assigning:', error);
    res.status(500).json({ error: 'Failed to assign service roles' });
  }
}

module.exports = {
  assignInstructor
};