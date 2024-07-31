const pool = require('../../db/index');

async function assignCourse(req) {
    try {
        const courseId = req.body.courseId; 
        const term = req.body.term;
        const profileId = req.body.profileId;

        // Check if the course and term exist in CourseByTerm
        const checkCourseTermQuery = `
            SELECT * FROM "CourseByTerm" WHERE "courseId" = $1 AND "term" = $2;
        `;
        const checkResult = await pool.query(checkCourseTermQuery, [courseId, term]);
        
        if (checkResult.rows.length === 0) {
            throw new Error('Create course for this term first');
        }

        // Insert the instructor assignment
        const insertQuery = `
            INSERT INTO "InstructorTeachingAssignment" ("profileId", "courseId", "term")
            VALUES ($1, $2, $3)
            ON CONFLICT ("profileId", "courseId", "term") DO NOTHING
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [profileId, courseId, term]);
        if (result.rows.length === 0) {
            throw new Error('Assignment already exists or could not be created');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error assigning instructor to course:', error);
        throw error;
    }
}

module.exports = {
    assignCourse
}
