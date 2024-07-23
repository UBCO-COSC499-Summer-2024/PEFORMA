const pool = require('../db/index');
const {getLatestTerm} = require('./latestTerm');
async function getLatestYear(){
    const latestTerm = await getLatestTerm();
    const latestYear = latestTerm.toString().substring(0, 4);
    return latestYear;
};
module.exports = {
    getLatestYear
}