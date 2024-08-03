const pool = require('../../db/index.js'); 
const { getAllServiceRoles } = require('../ShowList/serviceRoleService.js');
const {getLatestYear} = require('../latestYear.js');
async function getStatusChangeServiceRole(req) {
    const serviceRoleId = req.body.roleId; 

    try{
        const currentYear = await getLatestYear();
        let query = `INSERT "ServiceRole" ("serviceRoleId", "year") VALUES($1,$2) RETURNING *;`;
        let result = await pool.query(query, [serviceRoleId, currentYear]);
        if (result.rows.length === 0) {
            throw new Error("No service role data found");
        } else {
            const rolesData = await getAllServiceRoles(); 
            return rolesData;
        }
    }
    catch (error) {
        throw error;
    }
};
module.exports = {
    getStatusChangeServiceRole
}