const  pool = require('../db/index.js'); // Adjust the path as necessary for your db connection
console.log(pool); // See what pool actually is

exports.editServiceHour = async(req, res) => {
    const profileId = req.query.profileId;
    const newBenchmark = req.query.benchmark;

    let query = `UPDATE "Profile" SET "benchmark" = $1 WHERE "profileId" = $2 RETURNING *;`; // This will return the updated row
    try {
        let result = await pool.query(query, [newBenchmark, profileId]);

        if (result.rowCount === 0) {
            // No rows updated, probably because no profile with the given ID exists
            res.status(404).json({ message: 'Profile not found' });
        } else {
            // Success
            res.status(200).json({ message: 'Benchmark updated successfully', data: result.rows[0] });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error during updating benchmark' });
    }
};
