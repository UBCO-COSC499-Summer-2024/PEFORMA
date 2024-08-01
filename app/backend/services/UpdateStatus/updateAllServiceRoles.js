const pool = require('../../db/index.js'); 
const { getLatestYear } = require('../latestYear.js');

async function updateAllServiceRoles() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');  // Start a transaction

        const latestYear = await getLatestYear();

        // Activate courses for the latest term
        const activateQuery = `
            UPDATE "ServiceRole" SET "isActive" = true 
            FROM "ServiceRoleAssignment"
            WHERE "ServiceRole"."serviceRoleId" = "ServiceRoleAssignment"."serviceRoleId" 
              AND "ServiceRoleAssignment"."year" = $1;
        `;
        await client.query(activateQuery, [latestYear]);

        // Deactivate courses not in the latest term
        const deactivateQuery = `
            UPDATE "ServiceRole" SET "isActive" = false 
            WHERE "serviceRoleId" NOT IN (
                SELECT "serviceRoleId" 
                FROM "ServiceRoleAssignment" 
                WHERE "year" = $1
            );
        `;
        await client.query(deactivateQuery, [latestYear]);

        await client.query('COMMIT');  // Commit the transaction
        console.log('Courses activation updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');  // Rollback the transaction on error
        console.error("Error updating course status:", error);
        throw error;
    } finally {
        client.release();  // Release the client back to the pool
    }
}

module.exports = {
    updateAllServiceRoles
}
