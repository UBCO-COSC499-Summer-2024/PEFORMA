module.exports.upsertProfile =  async function upsertProfile(data) {
    const pool = require('../db/index');
    const existingProfileId = await checkProfileExists(data.email);

    if (existingProfileId) {
        // 更新现有记录
        const updateQuery = `
            UPDATE "Profile"
            SET "firstName" = $1, "lastName" = $2, "phoneNum" = $3, "officeBuilding" = $4, "officeNum" = $5, "position" = $6, "divisionId" = $7, "UBCId" = $8
            WHERE "profileId" = $9
            RETURNING "profileId";
        `;
        const updateValues = [data.firstName, data.lastName, data.phoneNum, data.officeBuilding, data.officeNum, data.position, data.divisionId, data.UBCId, existingProfileId];
        const updateResult = await pool.query(updateQuery, updateValues);
        return updateResult.rows[0].profileId;
    } else {
        // 插入新记录
        const insertQuery = `
            INSERT INTO "Profile" ("firstName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING "profileId";
        `;
        const insertValues = [data.firstName, data.lastName, data.email, data.phoneNum, data.officeBuilding, data.officeNum, data.position, data.divisionId, data.UBCId];
        const insertResult = await pool.query(insertQuery, insertValues);
        return insertResult.rows[0].profileId;
    }
}

async function checkProfileExists(email) {
    const pool = require('../db/index');
    const checkQuery = `SELECT "profileId" FROM "Profile" WHERE "email" = $1;`;
    const result = await pool.query(checkQuery, [email]);
    return result.rows.length > 0 ? result.rows[0].profileId : null;
}