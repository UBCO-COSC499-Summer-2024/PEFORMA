const pool = require('../db/index.js');

async function getAllServiceRoles() {
  try {
    const countResult = await pool.query(`SELECT COUNT(*) 
                                          FROM public."ServiceRole"
                                          WHERE "isActive" = true`);
    const rolesCount = parseInt(countResult.rows[0].count);

    const result = await pool.query(`
        SELECT "serviceRoleId" as id,
               "stitle" as name, 
               "description", 
               "dname" as department,
               s."isActive" 
        FROM public."ServiceRole" s
        JOIN public."Division" d ON s."divisionId" = d."divisionId"
        WHERE s."isActive" = true  
        ORDER BY d."divisionId" ASC, s."stitle" ASC;
      `);

     // Reformat the data
     const formattedData = {
        currentPage: 1,
        perPage: 10,
        rolesCount: rolesCount,
        roles: result.rows.map(row => {
            return {
                id: row.id,
                name: row.name,
                department: row.department,
                description: row.description,
                status: row.isActive
            };
        })
    };


    return formattedData;
  } catch (error) {
    throw error; 
  }
}

module.exports = {
  getAllServiceRoles
};
