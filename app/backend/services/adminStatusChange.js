const  pool = require('../db/index.js'); 
const { getAllInstructors } = require('../services/allInstructorsService');  // Corrected import to directly destructure the function

async function StatusChangeMembers(req) {
    const ubcId = req.body.memberId; 
    const status = req.body.newStatus;
    console.log("Service Role ID: ",ubcId);
    console.log("Status: ", status);
    try{
        let query = `SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1;`;
        let result = await pool.query(query, [ubcId]);
        const profileId = result.rows[0].profileId;
        query = `UPDATE "Account" SET "isActive" = $1 WHERE "profileId" = $2 RETURNING *;`;
        result = await pool.query(query, [status, profileId]);
        if (result.rows.length === 0) {
            console.log("No account data found");
            throw new Error('No account data found');
        } else {
            console.log("Update status account complete");
            const rolesData = await getAllInstructors(); 
            return rolesData;
        }

    }
    catch (error) {
        console.error('Database query error:', error);
    }
};
module.exports = {
    StatusChangeMembers
}