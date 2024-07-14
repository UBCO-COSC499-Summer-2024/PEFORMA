const pool = require('../db/index');
const {getLatestYear} = require('./latestYear');
async function assignInstructor(req){
    serviceRoleId = req.query.serviceRoleId;
    const latestYear = getLatestYear();
    for (let instructorId of instructorList) {
        await pool.query(
            `INSERT INTO "ServiceRoleAssignment" ("profileId", "serviceRoleId","year")
             VALUES ($1, $2, $3)`,
            [instructorId, serviceRoleId,latestYear]
        );
    }
    return true;

};
module.exports = {
    assignInstructor
}