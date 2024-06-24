const  pool = require('../db/index.js'); 
console.log(pool); 

exports.getLeaderBoard = async (req, res) => {
    try {
        let query;
        let result;

        query = `SELECT "term" FROM "SingleTeachingPerformance" ORDER BY "term" DESC LIMIT 1;`;
        result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No performance data found.' });
        }
        const latestTerm = result.rows[0].term;

        console.log("Latest term: ", latestTerm);


        console.log("Latest term: ", latestTerm);
        query = `
        SELECT TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name, AVG(stp."score") AS average_score
        FROM "Profile" p
        JOIN "SingleTeachingPerformance" stp ON p."profileId" = stp."profileId"
        WHERE stp."term" = $1 
        GROUP BY p."profileId"
        ORDER BY average_score DESC
        LIMIT 3;`;
        result = await pool.query(query,[latestTerm]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No performance data found.' });
        }
         // Format data for output
         const output = {
            data: result.rows.map(row => ({
                x: row.full_name,
                y: parseFloat(row.average_score.toFixed(1)) // Formatting to one decimal place
            }))
        };
        console.log(output);
        return res.json(output);
      
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
