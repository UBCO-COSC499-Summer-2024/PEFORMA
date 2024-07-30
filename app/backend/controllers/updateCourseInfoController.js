const updateCourseInfoService = require('../services/updateCourseInfo.js');

async function updateCourseInfo (req, res) {
    try {
        await updateCourseInfoService.updateCourseInfo(req);
        res.status(200).send('Course information updated successfully');
    } catch (error) {
        console.error('Error updating course information:', error.stack);
        res.status(500).send('Error updating course information');
    }
};

module.exports = {
    updateCourseInfo
}