const courseEvaluationService = require('../../services/CourseEvaluation/courseEvaluation');

async function getCourseEvaluation(req, res) {
  try {
    const courseEvaluation = await courseEvaluationService.getCourseEvaluation(req);
    res.json(courseEvaluation);
  } catch (error) {
    console.error('Error uploading course evaluation:', error);
    res.status(500).json({ error: 'Failed to upload course evaluation' });
  }
}

module.exports = {
  getCourseEvaluation
};