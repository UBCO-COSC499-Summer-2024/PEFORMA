const pool = require('../../db/index.js');
const { getLatestYear } = require('../latestYear.js');
async function getServiceInfo(req){

    const serviceRoleId = req.query.serviceRoleId;
    try {
        const latestYear = await getLatestYear();
        //Get the service role info 
        let query = `
            SELECT sr."stitle", sr."description", d."dname", sr."isActive"
            FROM "ServiceRole" sr
            JOIN "Division" d ON d."divisionId" = sr."divisionId"
            WHERE sr."serviceRoleId" = $1;
        `;

        let result = await pool.query(query, [serviceRoleId]);
        const { stitle, description, dname, isActive } = result.rows[0];
        //Check if the service role exists in the year
        query = `SELECT * FROM "ServiceRoleByYear" WHERE "serviceRoleId" = $1 AND "year" = $2;`
        result = await pool.query(query,[serviceRoleId,latestYear]);
        let exists;
        if(result.rows.length == 0){
            exists = false;
        }
        else{
            exists = true;
        }
        //Get the instructors with the service role
        query = `
            SELECT p."UBCId", sra."year",
            TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name
            FROM "ServiceRoleAssignment" sra
            LEFT JOIN "Profile" p ON p."profileId" = sra."profileId"
            WHERE sra."serviceRoleId" = $1 AND sra."year" <= $2
            ORDER BY sra."year" DESC;
        `;
        result = await pool.query(query, [serviceRoleId, latestYear]);
        const assigneeCount = result.rows.length;
        //Format assignees
        const assignees = result.rows.map(row => ({
            instructorID: row.UBCId || '',
            name: row.full_name || '',
            year: row.year
        }));
        //Format the overall output
        const output = {
            currentPage: 1,
            perPage: 5,
            roleID: serviceRoleId,
            assigneeCount: assigneeCount,
            exists: exists,
            roleName: stitle || "",
            roleDescription: description || "",
            department: dname || "",
            assignees: assignees,
            latestYear: latestYear,
            isActive: isActive
        };
        return output;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
module.exports = {
    getServiceInfo
}