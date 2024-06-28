

module.exports.createAccount = async function createAccount(profileId, email, password) {
    const bcrypt = require('bcryptjs');
    const pool = require('../db/index');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 同步序列
    const syncSequenceQuery = `
    SELECT setval(pg_get_serial_sequence('"Account"', 'accountId'), (SELECT MAX("accountId") FROM "Account") + 1, false);
    `;
    await pool.query(syncSequenceQuery);

    const insertQuery = `
        INSERT INTO "Account" ("profileId", "email", "password", "isActive")
        VALUES ($1, $2, $3, $4)
        RETURNING "accountId";
    `;

    const result = await pool.query(insertQuery, [profileId, email, hashedPassword, true]);
    return result.rows[0].accountId;
}
