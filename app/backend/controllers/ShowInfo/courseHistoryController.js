const courseHistoryService = require('../../services/ShowInfo/courseHistory');

async function getCourseHistory(req, res) {
  try {
    const courses = await courseHistoryService.getCourseHistory(req); //Execute service
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

module.exports = {
  getCourseHistory
};
