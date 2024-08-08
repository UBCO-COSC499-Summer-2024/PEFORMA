const courseService = require('../../services/ShowList/courseService.js'); 

async function getCourses(req, res) {
    try {
        const divisionCode = req.query.division;
        const formattedData = await courseService.getFormattedCourseData(divisionCode); //Execute service
        res.json(formattedData);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = {
    getCourses
};
