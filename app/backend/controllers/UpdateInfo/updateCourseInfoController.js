const updateCourseInfoService = require('../../services/UpdateInfo/updateCourseInfo');

async function updateCourseInfo (req, res) {
    try {
        await updateCourseInfoService.updateCourseInfo(req); //Execute service
        res.status(200).send('Course information updated successfully'); 
    } catch (error) {
        console.error('Error updating course information:', error.stack);
        res.status(500).send('Error updating course information');
    }
};

module.exports = {
    updateCourseInfo
}