const pool = require('../db/index');
async function getLatestYear(){
    const query = `SELECT "year" FROM "ServiceRoleAssignment"
                   ORDER BY "year" DESC LIMIT 1;`;
    const result = await pool.query(query);
    const latestYear = result.rows[0].year;
    return latestYear;
};
module.exports = {
    getLatestYear
}