const pool = require('../../db/index.js'); 
const { getAllServiceRoles } = require('../ShowList/serviceRoleService.js');

async function getStatusChangeServiceRole(req) {
    const serviceRoleId = req.body.roleId; 
    const status = req.body.newStatus;

    try{
        let query = `UPDATE "ServiceRole" SET "isActive" = $1 WHERE "serviceRoleId" = $2 RETURNING *;`;
        let result = await pool.query(query, [status, serviceRoleId]);
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