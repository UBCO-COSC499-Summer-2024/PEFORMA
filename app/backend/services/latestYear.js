const {getLatestTerm} = require('./latestTerm');
async function getLatestYear(){
    //Get the current term
    const latestTerm = await getLatestTerm();
    //Retrieve the first four letters for the year
    const latestYear = latestTerm.toString().substring(0, 4);
    return latestYear;
};
module.exports = {
    getLatestYear
}