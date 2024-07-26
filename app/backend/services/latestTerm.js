const pool = require('../db/index');
async function getLatestTerm(){
    const query = `SELECT "curTerm" FROM "CurrentTerm" LIMIT 1;`;
    const result = await pool.query(query);
    const latestTerm = result.rows[0].curTerm;
    return latestTerm;
};
module.exports = {
    getLatestTerm
}