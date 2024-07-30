const pool = require('../../db/index.js'); 
const { getLatestTerm } = require('../latestTerm.js');

async function updateAllCourses() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');  // Start a transaction

        const latestTerm = await getLatestTerm();

        // Activate courses for the latest term
        const activateQuery = `
            UPDATE "Course" SET "isActive" = true 
            FROM "CourseByTerm"
            WHERE "Course"."courseId" = "CourseByTerm"."courseId" 
              AND "CourseByTerm"."term" = $1;
        `;
        await client.query(activateQuery, [latestTerm]);

        // Deactivate courses not in the latest term
        const deactivateQuery = `
            UPDATE "Course" SET "isActive" = false 
            WHERE "courseId" NOT IN (
                SELECT "courseId" 
                FROM "CourseByTerm" 
                WHERE "term" = $1
            );
        `;
        await client.query(deactivateQuery, [latestTerm]);

        await client.query('COMMIT');  // Commit the transaction
        console.log('Courses activation updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');  // Rollback the transaction on error
        console.error("Error updating course status:", error);
        throw error;
    } finally {
        client.release();  // Release the client back to the pool
    }
}

module.exports = {
    updateAllCourses
}
