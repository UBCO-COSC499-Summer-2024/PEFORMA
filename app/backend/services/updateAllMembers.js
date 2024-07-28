const pool = require('../db/index.js');
const { getLatestTerm } = require('./latestTerm.js');
const { getLatestYear } = require('./latestYear.js');

async function updateAllMembers() {
    try {
        const currentTerm = await getLatestTerm();
        const currentYear = await getLatestYear();

        let query = `SELECT p."profileId"
                     FROM "Profile" p
                     JOIN "Account" ac ON ac."profileId" = p."profileId"
                     JOIN "AccountType" act ON act."accountId" = ac."accountId"
                     GROUP BY p."profileId"
                     HAVING ARRAY_AGG(act."accountType") = ARRAY[3]
                     ORDER BY p."profileId" ASC`;
        let result = await pool.query(query);
        const instructorsList = result.rows.map(row => row.profileId);

        query = `SELECT "profileId" FROM "ServiceRoleAssignment" sra WHERE sra."year" = $1`;
        result = await pool.query(query, [currentYear]);
        const currentInstructors = result.rows.map(row => row.profileId);

        query = `SELECT "profileId" FROM "InstructorTeachingAssignment" ita WHERE ita."term" = $1`;
        result = await pool.query(query, [currentTerm]);
        result.rows.forEach(row => {
            if (!currentInstructors.includes(row.profileId)) {
                currentInstructors.push(row.profileId);
            }
        });

        const missingInstructors = instructorsList.filter(profileId => !currentInstructors.includes(profileId));
        const assignedInstructors = instructorsList.filter(profileId => currentInstructors.includes(profileId));

        // Begin transaction
        await pool.query('BEGIN');

        if (assignedInstructors.length > 0) {
            const activateQuery = `UPDATE "Account" SET "isActive" = true WHERE "profileId" = ANY($1)`;
            await pool.query(activateQuery, [assignedInstructors]);
        }
        
        if (missingInstructors.length > 0) {
            const deactivateQuery = `UPDATE "Account" SET "isActive" = false WHERE "profileId" = ANY($1)`;
            await pool.query(deactivateQuery, [missingInstructors]);
        }

        // Commit transaction
        await pool.query('COMMIT');
        return;
    } catch (error) {
        console.error("Error fetching instructors: ", error);
        await pool.query('ROLLBACK'); // Rollback transaction on error
    }
}

module.exports = {
    updateAllMembers
};
