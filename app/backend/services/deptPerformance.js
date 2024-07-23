const  pool = require('../db/index.js'); 
const {getLatestTerm} = require('./latestTerm.js');

async function getDepartPerformance() {
    try {
        let query;
        let result;

        const latestTerm = await getLatestTerm();
        //Fetch the average score by each divisionId for the latest term.
        query = `
            SELECT c."divisionId", AVG(stp.score) AS average_score
            FROM "SingleTeachingPerformance" stp
            JOIN "CourseByTerm" cbt ON stp."courseId" = cbt."courseId" AND stp."term" = cbt."term"
            JOIN "Course" c ON cbt."courseId" = c."courseId"
            WHERE stp."term" = $1
            GROUP BY c."divisionId"
            ORDER BY c."divisionId";
        `;

        result = await pool.query(query, [latestTerm]);
        if(result.length == 0){
            throw new Error("No dept performance data found");
        }
        // Map divisionId to the corresponding department names
        const labels = ["Computer Science", "Mathematics", "Physics", "Statistics"]; 
        const series = new Array(4).fill(0);  // Initialize an array to hold scores, pre-filled with 0 for all divisions

        // Populate the series array based on divisionId from the result
        result.rows.forEach(row => {
            const index = row.divisionId - 1;  // Assumes divisionId is 1-indexed and matches the order in `labels`
            series[index] = parseFloat(row.average_score.toFixed(2));  // Store average score, rounded to two decimal places
        });

        // Construct the final object
        const output = {
            series: series,
            labels: labels
        };

        return output;
      
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
    
};
module.exports = {
    getDepartPerformance
}
