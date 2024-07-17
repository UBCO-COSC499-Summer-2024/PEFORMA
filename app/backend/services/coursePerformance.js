const  pool = require('../db/index.js'); 
const {getLatestTerm} = require('./latestTerm.js');
async function getCoursePerformance(req){

    const divisionId = parseInt(req.query.divisionId);
    
    try {
        const term = await getLatestTerm();
        query = `SELECT d."dcode"  || ' ' || c."courseNum" AS "DivisionAndCourse",
        stp."score"
        FROM "SingleTeachingPerformance" stp
        JOIN "Course" c ON c."courseId" = stp."courseId"
        JOIN "Division" d ON d."divisionId" = c."divisionId"
        WHERE c."divisionId" = $1 AND stp."term" = $2
        ORDER BY stp."score" DESC;
        `;
        result = await pool.query(query,[divisionId,term]);
        const data = result.rows.map(row => ({
            courseCode: row.DivisionAndCourse || '',
            rank:calculateRank(row.score) || '',
            score: row.score.toFixed(2) || ''
        }));
        const output = {
            courses:data
        };
        return output;
    } catch (error) {
        throw error;
    }
    function calculateRank(score) {
        if (score >= 90) {
            return 'A';
        } else if (score >= 80) {
            return 'B';
        } else if (score >= 70) {
            return 'C';
        } else if (score >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }
};
module.exports = {
    getCoursePerformance
}
