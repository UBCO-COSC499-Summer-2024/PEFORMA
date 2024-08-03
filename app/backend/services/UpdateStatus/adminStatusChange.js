const pool = require('../../db/index.js'); 
const { getAllInstructors } = require('../ShowList/allInstructorsService.js');

async function StatusChangeMembers(req) {
    const ubcId = req.body.memberId; 
    const status = req.body.newStatus;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); 
            //Get the profileId from ubcid
            let query = `SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1;`;
            let result = await client.query(query, [ubcId]);
            if (result.rows.length === 0) {
                throw new Error('Profile not found');
            }
            const profileId = result.rows[0].profileId;
            //Get the account type of the instructor
            query = `SELECT ARRAY_AGG(ac."accountType") AS account_type FROM "AccountType" ac 
                     LEFT JOIN "Account" a ON a."accountId" = ac."accountId"
                     LEFT JOIN "Profile" p ON p."profileId" = a."profileId"
                     WHERE p."profileId" = $1
                     GROUP BY a."accountId"`;
            result = await client.query(query, [profileId]);
            const errors = [];
            result.rows.forEach(row => {
                if (row.account_type.includes(3)) { 
                    errors.push("You can only change status of sole department staff or admin.");
                }
            });
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            //Update the status of account
            query = `UPDATE "Account" SET "isActive" = $1 WHERE "profileId" = $2 RETURNING *;`;
            result = await client.query(query, [status, profileId]);
            if (result.rows.length === 0) {
                throw new Error('No account data found for update');
            }
            // Commit transaction
            await client.query('COMMIT'); 
            //Return all instructors
            const rolesData = await getAllInstructors(); 
            return rolesData;
        } catch (error) {
             // Roll back in case of error
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;  
    }
};

module.exports = {
    StatusChangeMembers
}
