const courseService = require('../services/courseService.js'); 

async function getCourses(req, res) {
    try {
        const divisionCode = req.query.division;
        const formattedData = await courseService.getFormattedCourseData(divisionCode);
        res.json(formattedData);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = {
    getCourses
};
