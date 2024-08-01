module.exports.assignServiceRole = async function assignServiceRole(profileId, serviceRole, year,division) {
    const pool = require('../../db/index');
    const allrole = `SELECT "stitle" FROM "ServiceRole"`;
    const allresult = await pool.query(allrole);
    const titles = allresult.rows.map(row => row.stitle);
    const serviceRoleQuery = `
        SELECT * FROM public."ServiceRole" WHERE "stitle" = $1 AND "divisionId" = $2;
    `;
    console.log(`serching for postion: ${serviceRole} in division: ${division}`)
    const roleResult = await pool.query(serviceRoleQuery,[serviceRole,division]);
    if (roleResult.rows.length === 0) {
        throw new Error("No role found");
    }
    const get_serviceRoleId = roleResult.rows[0].serviceRoleId;


    const insertQuery = `
        INSERT INTO "ServiceRoleAssignment" ("profileId", "serviceRoleId", "year")
        VALUES ($1, $2, $3)
        ON CONFLICT ("profileId", "serviceRoleId", "year") DO NOTHING
        RETURNING *;
    `;

    const result = await pool.query(insertQuery, [profileId, get_serviceRoleId, year]);
    return result.rows;
}