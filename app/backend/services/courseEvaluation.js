const pool = require('../db/index.js');
const { getLatestTerm } = require('./latestTerm.js');

async function getCourseEvaluation(req) {
    const { Q1, Q2, Q3, Q4, Q5, retentionRate, averageGrade, enrollmentRate, failedPercentage, courseId, profileId } = req.query;
    const latestTermResult = await getLatestTerm();

    //Check if the data exists in database
    let query = `SELECT * FROM "CourseEvaluation" WHERE "courseId" = $1 AND "term" = $2 AND "profileId" = $3`;
    let result = await pool.query(query, [courseId, latestTermResult, profileId]);

    if (result.rows.length === 0) {
        query = `INSERT INTO "CourseEvaluation" ("courseId", "term", "profileId", "SEIQ1", "SEIQ2", 
                "SEIQ3", "SEIQ4", "SEIQ5", "retentionRate", "failRate", "enrolRate", "averageGrade") 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
        result = await pool.query(query, [courseId, latestTermResult, profileId, Q1, Q2, Q3, Q4, Q5, retentionRate, failedPercentage, enrollmentRate, averageGrade]);
    } else {
        query = `UPDATE "CourseEvaluation" SET "SEIQ1" = $1, "SEIQ2" = $2, "SEIQ3" = $3, "SEIQ4" = $4, "SEIQ5" = $5, 
                "retentionRate" = $6, "failRate" = $7, "enrolRate" = $8, "averageGrade" = $9
                WHERE "courseId" = $10 AND "term" = $11 AND "profileId" = $12 RETURNING *`;
        result = await pool.query(query, [Q1, Q2, Q3, Q4, Q5, retentionRate, failedPercentage, enrollmentRate, averageGrade, courseId, latestTermResult, profileId]);
    }

    if (result.rows.length > 0) {
        const { SEIQ1, SEIQ2, SEIQ3, SEIQ4, SEIQ5 } = result.rows[0];
        const score = computeScore(SEIQ1, SEIQ2, SEIQ3, SEIQ4, SEIQ5, retentionRate, averageGrade, enrollmentRate, failedPercentage);
        query = `UPDATE "SingleTeachingPerformance" SET "score" = $1 WHERE "courseId" = $2 AND "term" = $3 AND "profileId" = $4`;
        await pool.query(query, [score, courseId, latestTermResult, profileId]);
    }

    return true;
}

function computeScore(Q1, Q2, Q3, Q4, Q5, retentionRate, averageGrade, enrollmentRate, failedPercentage) {
    const score = 0.4 * (Q1 + Q2 + Q3 + Q4 + Q5) + 0.15 * retentionRate + 0.15 * averageGrade - 0.15 * enrollmentRate - 0.15 * failedPercentage;
    return score;
}

module.exports = {
    getCourseEvaluation
};
