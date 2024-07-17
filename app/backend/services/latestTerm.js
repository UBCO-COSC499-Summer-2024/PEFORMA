const pool = require('../db/index');
async function getLatestTerm(){
    const query = `SELECT "term" FROM "InstructorTeachingAssignment"
                   ORDER BY "term" DESC LIMIT 1;`;
    const result = await pool.query(query);
    const latestTerm = result.rows[0].term;
    return latestTerm;
};
module.exports = {
    getLatestTerm
}