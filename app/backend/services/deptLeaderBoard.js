const  pool = require('../db/index.js'); 
const {getLatestTerm} = require('./latestTerm.js');
async function getDeptLeaderBoard(){
    try {
        const latestTerm = await getLatestTerm();
          let topPerformers = await pool.query(`
            SELECT TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name, AVG(stp."score") AS average_score
            FROM "Profile" p
            JOIN "SingleTeachingPerformance" stp ON p."profileId" = stp."profileId"
            WHERE stp."term" = $1 
            GROUP BY p."profileId"
            ORDER BY average_score DESC
            LIMIT 5;`, [latestTerm]);

        let bottomPerformers = await pool.query(`
            SELECT TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name, AVG(stp."score") AS average_score
            FROM "Profile" p
            JOIN "SingleTeachingPerformance" stp ON p."profileId" = stp."profileId"
            WHERE stp."term" = $1 
            GROUP BY p."profileId"
            ORDER BY average_score ASC
            LIMIT 5;`, [latestTerm]);

        if (topPerformers.rows.length === 0 && bottomPerformers.rows.length === 0) {
            throw new Error("No data found");
        }

        const output = {
            top: topPerformers.rows.map(row => ({
                name: row.full_name,
                score: parseFloat(row.average_score.toFixed(1))
            })),
            bottom: bottomPerformers.rows.map(row => ({
                name: row.full_name,
                score: parseFloat(row.average_score.toFixed(1))
            }))
        };
        return output;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
    
};
module.exports = {
    getDeptLeaderBoard
}
