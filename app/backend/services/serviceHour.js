const pool = require('../db/index');
const {getLatestYear} = require('./latestYear');
async function getServiceHour(profileId){
    const year = await getLatestYear();
    try{
        let query = `
            SELECT sra."profileId", sra."serviceRoleId", sra."year", sry."JANHour", sry."FEBHour",
            sry."MARHour", sry."APRHour", sry."MAYHour", sry."JUNHour",sry."JULHour",
            sry."AUGHour", sry."SEPHour", sry."OCTHour", sry."NOVHour", sry."DECHour"
            FROM "ServiceRoleAssignment" sra
            JOIN "ServiceRoleByYear" sry ON sra."serviceRoleId" = sry."serviceRoleId" 
            AND 
            sra."year" = sry."year"
            WHERE sra."profileId" = $1 AND sra."year" = $2;
        `; 
        result = await pool.query(query,[profileId,year]);
        if (result.rows.length === 0) {
            throw new Error("No service hour data found");
        }
        return result;
    }
    catch(error){
        throw error;
    }
};
module.exports = {
    getServiceHour
}