const  pool = require('../../db/index.js'); 
const {updateAllCourses} = require('../UpdateStatus/updateAllCourses.js');
const {getLatestTerm} = require('../latestTerm.js');

async function getCoursePerformance(req){

    const divisionId = parseInt(req.query.divisionId);
    
    try {
        await updateAllCourses();
        //Get the average score for each score
        const term = await getLatestTerm();
        query = `SELECT d."dcode" || ' ' || c."courseNum" AS "DivisionAndCourse",
                    COALESCE(AVG(stp."score"), 0) AS "AverageScore"
                FROM "Course" c
                LEFT JOIN "CourseByTerm" cbt ON cbt."courseId" = c."courseId"
                LEFT JOIN "SingleTeachingPerformance" stp ON stp."courseId" = cbt."courseId" AND stp."term" = cbt."term"
                LEFT JOIN "Division" d ON d."divisionId" = c."divisionId"
                WHERE c."divisionId" = $1 AND c."isActive" = true
                AND (stp."term" IS NULL OR stp."term" <= $2)
                GROUP BY d."dcode", c."courseNum"
                ORDER BY c."courseNum" DESC;`;
        result = await pool.query(query,[divisionId,term]);
        const data = result.rows.map(row => ({
            courseCode: row.DivisionAndCourse || '',
            rank:calculateRank(row.AverageScore) || '',
            score: row.AverageScore.toFixed(2) || ''
        }));
        const output = {
            courses:data,
            currentTerm:term
        };
        console.log("output",output);
        return output;
    } catch (error) {
        throw error;
    }
    //Based on the score, rank based on A to F. If it is 0, N/A
    function calculateRank(score) {
        if (score >= 90) {
            return 'A';
        } else if (score >= 80) {
            return 'B';
        } else if (score >= 70) {
            return 'C';
        } else if (score >= 60) {
            return 'D';
        } else if (score < 60 && score != 0){
            return 'F';
        }
        else{
            return 'N/A';
        }
    }
};
module.exports = {
    getCoursePerformance
}