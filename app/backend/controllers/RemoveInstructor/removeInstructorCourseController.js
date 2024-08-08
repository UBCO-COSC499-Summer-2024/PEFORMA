const removeInstructorCourseService = require('../../services/RemoveInstructor/removeInstructorCourse');
exports.removeInstructorCourse = async (req, res) => {

  try {
    await removeInstructorCourseService.removeInstructorCourse(req);
    res.status(200).json({ message: 'Instructor removed from course assignment'});//Execute service
  } catch (error) {
    console.error('Error removing instructor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
