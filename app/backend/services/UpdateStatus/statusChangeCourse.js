const pool = require('../../db/index.js'); 
const { getAllCourses } = require('../ShowList/allCoursesService.js'); 
const { getLatestTerm } = require('../latestTerm.js'); 

async function getStatusChangeCourse(req) {
    const courseId = req.body.courseid; 
    const currentTerm = await getLatestTerm();
    const status = req.body.newStatus;
    
    try {
        if (status) {
            const query = `INSERT INTO "CourseByTerm" ("courseId", "term") VALUES ($1, $2) ON CONFLICT DO NOTHING`;
            await pool.query(query, [courseId, currentTerm]);
        } else {
            await pool.query('BEGIN');
            const tablesToDeleteFrom = ["CourseByTerm", "InstructorTeachingAssignment", "SingleTeachingPerformance", "CourseEvaluation", "SurveyQuestionResponse", "TaAssignmentTable"];
            for (const table of tablesToDeleteFrom) {
                const query = `DELETE FROM "${table}" WHERE "courseId" = $1 AND "term" = $2`;
                await pool.query(query, [courseId, currentTerm]);
            }
            await pool.query('COMMIT');
        }
        const courseData = await getAllCourses();
        return courseData;
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Failed to update course status:', error);
        throw new Error('Error updating course status.');
    }
};

module.exports = {
    getStatusChangeCourse
};
