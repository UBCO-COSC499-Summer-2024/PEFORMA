const courseEvaluationFormService = require('../../services/CourseEvaluation/courseEvaluationForm');
async function getCourseInformation(req, res) {
  try {
    const formData = await courseEvaluationFormService.getCourseInformation();
    res.json(formData);
  } catch (error) {
    console.error('Error uploading course evaluation:', error);
    res.status(500).json({ error: 'Failed to upload course evaluation' });
  }
}

module.exports = {
  getCourseInformation
};