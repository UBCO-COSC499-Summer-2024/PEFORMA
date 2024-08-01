const pool = require('../../db/index.js');
const { getLatestYear } = require('../latestYear.js');
async function getServiceInfo(req){

    const serviceRoleId = req.query.serviceRoleId;
    try {
        const latestYear = await getLatestYear();
        //Get the service role info 
        let query = `
            SELECT sr."stitle", sr."description", d."dname"
            FROM "ServiceRole" sr
            JOIN "Division" d ON d."divisionId" = sr."divisionId"
            WHERE sr."serviceRoleId" = $1;
        `;

        let result = await pool.query(query, [serviceRoleId]);
        const { stitle, description, dname } = result.rows[0];
        query = `SELECT * FROM "ServiceRoleByYear" WHERE "serviceRoleId" = $1 AND "year" = $2;`
        result = await pool.query(query,[serviceRoleId,latestYear]);
        let exists;
        if(result.length == 0){
            exists = false;
        }
        else{
            exists = true;
        }
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
        
        const assignees = result.rows.map(row => ({
            instructorID: row.UBCId || '',
            name: row.full_name || '',
            year: row.year
        }));

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
            latestYear: latestYear
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