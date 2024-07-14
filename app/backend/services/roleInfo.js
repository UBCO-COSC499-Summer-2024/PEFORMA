const pool = require('../db/index.js');

async function getServiceInfo(req){

    const serviceRoleId = req.query.serviceRoleId;
    try {
        // let query = `SELECT "year" FROM "ServiceRoleAssignment" ORDER BY "year" DESC LIMIT 1;`;
        // let result = await pool.query(query);
        let query = `
            SELECT sr."stitle", sr."description", d."dname", p."UBCId",
            TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name
            FROM "ServiceRole" sr
            JOIN "Division" d ON d."divisionId" = sr."divisionId"
            LEFT JOIN "ServiceRoleAssignment" sra ON sra."serviceRoleId" = sr."serviceRoleId"
            LEFT JOIN "Profile" p ON p."profileId" = sra."profileId"
            WHERE sr."serviceRoleId" = $1
            ORDER BY sra."year" DESC;
        `;
        let result = await pool.query(query, [serviceRoleId]);
        const { stitle, description, dname } = result.rows[0];
        const assigneeCount = result.rows.length;
        const assignees = result.rows.map(row => ({
            instructorID: row.UBCId || '',
            name: row.full_name || ''
        }));

        const output = {
            currentPage: 1,
            perPage: 5,
            roleID: serviceRoleId,
            assigneeCount: assigneeCount,
            roleName: stitle || "",
            roleDescription: description || "",
            department: dname || "",
            benchmark:0,
            assignees: assignees
        };
        return output;
    } catch (error) {
        console.error('Database query error:', error);
    }
};
module.exports = {
    getServiceInfo
}