const  pool = require('../db/index.js'); 
console.log(pool); 

exports.getDeptLeaderBoard = async (req, res) => {
    try {
        let query;
        let result;

        query = `SELECT "term" FROM "SingleTeachingPerformance" ORDER BY "term" DESC LIMIT 1;`;
        result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No performance data found.' });
        }
        const latestTerm = result.rows[0].term;
          // Always proceed to make the next database queries even if no data
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
            return res.status(404).json({ message: 'No performance data found.' });
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
        return res.json(output);
      
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
