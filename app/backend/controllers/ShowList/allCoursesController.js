const allCoursesService = require('../../services/ShowList/allCoursesService');

async function getAllCourses(req, res) {
  try {
    const courses = await allCoursesService.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

module.exports = {
  getAllCourses
};
