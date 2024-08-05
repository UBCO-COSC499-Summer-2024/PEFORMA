const pool = require('../../db/index.js'); 
const { getAllServiceRoles } = require('../ShowList/serviceRoleService.js');
const {getLatestYear} = require('../latestYear.js');
async function getStatusChangeServiceRole(req) {
    //Get the service role id and the status from FE
    const serviceRoleId = req.body.roleId; 
    const status = req.body.newStatus;
    let query;
    let result;
    try{
        const currentYear = await getLatestYear();
        //If the newstatus is true
        if(status){
            query = `INSERT INTO "ServiceRoleByYear" ("serviceRoleId", "year", "JANHour", "FEBHour", "MARHour", "APRHour", "MAYHour", "JUNHour", "JULHour", "AUGHour", "SEPHour", "OCTHour", "NOVHour", "DECHour") 
                    VALUES($1,$2,0,0,0,0,0,0,0,0,0,0,0,0) RETURNING *;`;
            result = await pool.query(query, [serviceRoleId, currentYear]);
            if (result.rows.length === 0) {
                throw new Error("No service role data found");
            } 
        }
        //If the new status is false
        else {
            await pool.query('BEGIN');
            const tablesToDeleteFrom = ["ServiceRoleAssignment", "ServiceRoleByYear"];
            for (const table of tablesToDeleteFrom) {
                const query = `DELETE FROM "${table}" WHERE "serviceRoleId" = $1 AND "year" = $2`;
                await pool.query(query, [serviceRoleId, currentYear]);
            }
            await pool.query('COMMIT');
        }
        //return all roles up to date
        const rolesData = await getAllServiceRoles(); 
        return rolesData;
    }
    catch (error) {
        throw error;
    }
};
module.exports = {
    getStatusChangeServiceRole
}