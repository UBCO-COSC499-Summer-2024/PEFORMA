async function createAccount(req) {
    const bcrypt = require('bcryptjs');
    const pool = require('../db/index');
    let { email, password, firstName, lastName, ubcId, division, accountType } = req.body;
    const client = await pool.connect(); 
    try {

        if (division === '5' || division === 5) {
            division = null;
        }
        await client.query('BEGIN');
         // Check if the email already exists
         const emailCheckQuery = `SELECT "email" FROM "Account" WHERE "email" = $1;`;
         const emailCheckResult = await client.query(emailCheckQuery, [email]);
         if (emailCheckResult.rows.length > 0) {
            const error = new Error('Email already exists');
            error.status = 409; 
            throw error;
         }
         //check if ubc id already exists
         const ubcCheckQuery = `SELECT "UBCId" FROM "Profile" WHERE "UBCId" = $1;`;
         const ubcCheckResult = await client.query(ubcCheckQuery,[ubcId]);
         if (ubcCheckResult.rows.length > 0) {
            const error = new Error('UBCID already exists');
            error.message = "UBCID already exists";
            error.status = 409; 
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        let query = `SELECT setval(pg_get_serial_sequence('"Profile"', 'profileId'), MAX("profileId")) FROM "Profile";`;
        await client.query(query);
         query = `
            INSERT INTO "Profile" ("firstName", "lastName", "UBCId", "divisionId", "email")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING "profileId";
        `;
        let result = await client.query(query, [firstName, lastName, ubcId, division, email]); // Insert into Profile table
        const profileId = result.rows[0].profileId;
        query = `SELECT setval(pg_get_serial_sequence('"Account"', 'accountId'), MAX("accountId")) FROM "Account";`;
        await client.query(query);
        query = `
            INSERT INTO "Account" ("profileId", "email", "password", "isActive")
            VALUES ($1, $2, $3, $4)
            RETURNING "accountId";
        `;
        result = await client.query(query, [profileId, email, hashedPassword, true]); //Insert into account table
        await client.query('COMMIT');
        const accountId = result.rows[0].accountId;

        for(let i = 0; i<accountType.length; i++){
            query = `INSERT INTO "AccountType" ("accountId", "accountType")
                    VALUES ($1,$2)`;
            result = await client.query(query, [accountId, accountType[i]]);
        } //Insert into account type 
        return true; 
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error creating account: ", error);
        throw error;  
    } finally {
        client.release(); 
    }
}

module.exports = {
    createAccount
};
