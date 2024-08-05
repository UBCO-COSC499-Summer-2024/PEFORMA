const pool = require('../../db/index'); 
//Fetches all the instructors to assign
async function instructorFetch(){
    try {
        //Get all the instructors from the db
        const result = await pool.query(
            `
             SELECT "profileId", "UBCId" AS "id",
                   "firstName" || ' ' || COALESCE("middleName" || ' ', '') || "lastName" AS "name"
            FROM "Profile"
            `
        );
        const output = {
            instructors: result.rows,
            instructorCount: result.rowCount,
            perPage: 8,
            currentPage: 1

        };
            
        return output;
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    instructorFetch
}

