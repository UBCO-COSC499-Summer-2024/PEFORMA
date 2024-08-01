const assignCourseController = require('../../services/AssignInstructor/assignCourse');
async function assignCourse (req, res) {
  try {
    const result = await assignCourseController.assignCourse(req);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error assigning instructor to course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    assignCourse
}