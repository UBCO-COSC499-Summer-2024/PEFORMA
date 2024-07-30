const pool = require('../db/index.js');
const {getLatestTerm} = require('./latestTerm.js');
const {updateAllMembers} = require('./UpdateStatus/updateAllMembers.js');

async function getAllInstructors()  {
    try {
        await updateAllMembers();
        const currentTerm = await getLatestTerm();
        let query = `
            SELECT p."UBCId", 
                   TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name, 
                   d."dname" AS department,
                   ARRAY_AGG(sra."serviceRoleId") AS roleid,
                   ARRAY_AGG(sr."stitle") AS serviceRole,
                   p."email",
                   a."isActive"
            FROM "Profile" p
            LEFT JOIN "Division" d ON d."divisionId" = p."divisionId"
            LEFT JOIN "ServiceRoleAssignment" sra ON sra."profileId" = p."profileId"
            LEFT JOIN "ServiceRole" sr ON sr."serviceRoleId" = sra."serviceRoleId"
            LEFT JOIN "Account" a ON a."profileId" = p."profileId"
            GROUP BY p."UBCId", p."firstName", p."middleName", p."lastName", d."dname", p."email", a."isActive";
        `;
        const result = await pool.query(query);
        const members = result.rows.map(row => ({
            ubcid: row.UBCId || '',
            name: row.full_name || '',
            department: row.department || '',
            roleid: row.roleid || '',
            serviceRole: row.servicerole || '',
            email: row.email || '',
            status: row.isActive || ''
        }));

        const output = {
            currentPage: 1,
            perPage: 10,
            currentTerm: currentTerm,
            membersCount: members.length,
            members: members
        };
        return output;
    } catch (error) {
       throw error;
    }
}
module.exports = {
    getAllInstructors
  };
