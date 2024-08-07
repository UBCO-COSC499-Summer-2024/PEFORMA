const pool = require('../../db/index.js');
const { getLatestTerm } = require('../latestTerm.js');

async function getCourseEvaluation(req) {
    const { courseId, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, averageGrade, enrollmentRate, failedPercentage } = req.body;
    const latestTerm = await getLatestTerm();

    try {
        //Check if course evaluation exists in the specific term
        const existingEval = await checkExistingEvaluation(courseId, latestTerm, profileId);
        //If exists, update
        if (existingEval) {
            await updateCourseEvaluation(courseId, latestTerm, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, failedPercentage, enrollmentRate, averageGrade);
        } 
        //If doesnt exist, insert
        else {
            await insertCourseEvaluation(courseId, latestTerm, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, failedPercentage, enrollmentRate, averageGrade);
        }

        await updateTeachingPerformance(courseId, latestTerm, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, averageGrade, enrollmentRate, failedPercentage);
        return true;
    } catch (error) {
        console.error('Failed to update course evaluation:', error);
        throw error;
    }
};
//function to check if the course evaluation exists
async function checkExistingEvaluation(courseId, term, profileId) {
    const query = `SELECT * FROM "CourseEvaluation" WHERE "courseId" = $1 AND "term" = $2 AND "profileId" = $3`;
    const result = await pool.query(query, [courseId, term, profileId]);
    return result.rows.length > 0;
};
//function to see insert course evaluation
async function insertCourseEvaluation(courseId, term, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, failRate, enrolRate, averageGrade) {
    const query = `INSERT INTO "CourseEvaluation" ("courseId", "term", "profileId", "SEIQ1", "SEIQ2", "SEIQ3", "SEIQ4", "SEIQ5", "SEIQ6" , "retentionRate", "failRate", "enrolRate", "averageGrade") 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
    await pool.query(query, [courseId, term, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, failRate, enrolRate, averageGrade]);
};
//function to update course evaluation
async function updateCourseEvaluation(courseId, term, profileId, Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, failRate, enrolRate, averageGrade) {
    const query = `UPDATE "CourseEvaluation" SET "SEIQ1" = $1, "SEIQ2" = $2, "SEIQ3" = $3, "SEIQ4" = $4, "SEIQ5" = $5, "SEIQ6" = $6
                "retentionRate" = $7, "failRate" = $8, "enrolRate" = $9, "averageGrade" = $10
                WHERE "courseId" = $11 AND "term" = $12 AND "profileId" = $13 RETURNING *`;
    await pool.query(query, [Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, failRate, enrolRate, averageGrade, courseId, term, profileId]);
};
//function to update the score of instructor in the single teaching performance table
async function updateTeachingPerformance(courseId, term, profileId, Q1, Q2, Q3, Q4, Q5, Q6 , retentionRate, averageGrade, enrolRate, failRate) {
    const score = computeScore(Q1, Q2, Q3, Q4, Q5, Q6,retentionRate, averageGrade, enrolRate, failRate);
    const queryCheck = `SELECT * FROM "SingleTeachingPerformance" WHERE "courseId" = $1 AND "term" = $2 AND "profileId" = $3`;
    const checkResult = await pool.query(queryCheck, [courseId, term, profileId]);
//If the score is not there, insert the score
    if (checkResult.rows.length === 0) {
        const queryInsert = `INSERT INTO "SingleTeachingPerformance" ("courseId", "term", "profileId", "score")
                            VALUES ($1, $2, $3, $4)`;
        await pool.query(queryInsert, [courseId, term, profileId, score]);
    } else {
        //If the score is there, update
        const queryUpdate = `UPDATE "SingleTeachingPerformance" SET "score" = $1 WHERE "courseId" = $2 AND "term" = $3 AND "profileId" = $4`;
        await pool.query(queryUpdate, [score, courseId, term, profileId]);
    }
};
//Compute the score based on the course evaluation
function computeScore(Q1, Q2, Q3, Q4, Q5, Q6, retentionRate, averageGrade, enrolRate, failRate) {
    const averageQuestionScore = (parseFloat(Q1)+parseFloat(Q2)+parseFloat(Q3)+parseFloat(Q4)+parseFloat(Q5)+parseFloat(Q6))/6;

    const baseScore = 0.5 * averageQuestionScore + 0.1 * parseFloat(retentionRate) + 0.1 * parseFloat(averageGrade)+0.15*parseFloat(enrolRate);
    const penalty = 0.15 * parseFloat(failRate);

    let finalScore = baseScore - penalty;

    finalScore = Math.max(0, Math.min(100, finalScore));
    return finalScore;
};



module.exports = {
    getCourseEvaluation, updateTeachingPerformance
};
