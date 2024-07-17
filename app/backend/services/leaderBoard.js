const  pool = require('../db/index.js'); 
const {getLatestTerm} = require('./latestTerm');
async function getLeaderBoard() {
    try {

        const latestTerm = await getLatestTerm();
        let query = `
        SELECT TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name, AVG(stp."score") AS average_score
        FROM "Profile" p
        JOIN "SingleTeachingPerformance" stp ON p."profileId" = stp."profileId"
        WHERE stp."term" = $1 
        GROUP BY p."profileId"
        ORDER BY average_score DESC
        LIMIT 5;`;
        let result = await pool.query(query,[latestTerm]);

        if (result.rows.length === 0) {
           throw new Error("No data found");
        }
         // Format data for output
         const output = {
            data: result.rows.map(row => ({
                x: row.full_name,
                y: parseFloat(row.average_score.toFixed(1)) 
            }))
        };
        return output;
      
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
    
};
module.exports = {
    getLeaderBoard
}
