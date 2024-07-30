const pool = require('../../db/index.js');

async function updateRoleInfo(req)  {
    const newServiceRole = req.body;
    var divisionid=0;
    switch(newServiceRole.department){
        case "Computer Science": divisionid=1;break;
        case "Mathematics": divisionid=2;break;
        case "Physics": divisionid=3;break;
        case "Statistics": divisionid=4;break;
        default: divisionid=0;
    }

    const data = [
        newServiceRole.roleName, 
        newServiceRole.roleDescription,
        newServiceRole.isActive,
        divisionid,
        newServiceRole.roleID
    ];

    const query = `
    UPDATE "ServiceRole"
    SET "stitle" = $1,
    "description" = $2,
    "isActive" = $3,
    "divisionId" = $4
    WHERE "serviceRoleId" = $5
    `;
    try {
        const result = await pool.query(query, data);
        return result;
    } catch (error) {
        console.error('Error executing query:', error.stack);
        throw error;
    }
    };

module.exports = {
    updateRoleInfo
}