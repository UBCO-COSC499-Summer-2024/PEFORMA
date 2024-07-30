const pool = require('../../db/index.js');

async function updateCourseInfo(req)  {
    const { courseId, courseDescription } = req.body;
    try {
        const query = 'UPDATE "Course" SET "description" = $1 WHERE "courseId" = $2';
        await pool.query(query, [courseDescription, courseId]);
        return true;
    } catch (error) {
        console.error('Error updating course information:', error.stack);
        throw error;
    }
};

module.exports = {
    updateCourseInfo
}