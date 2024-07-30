const  pool = require('../../db/index.js'); 
const {getServiceHour} = require('./serviceHour.js');
async function getProgress(req) {
    try {
        const profileId = req.query.profileId;
        //Query the monthly service hour of the instructor        
        let result = await getServiceHour(profileId);
        const totals = result.rows.reduce((acc, row) => {
            acc.JANHour += row.JANHour || 0;
            acc.FEBHour += row.FEBHour || 0;
            acc.MARHour += row.MARHour || 0;
            acc.APRHour += row.APRHour || 0;
            acc.MAYHour += row.MAYHour || 0;
            acc.JUNHour += row.JUNHour || 0;
            acc.JULHour += row.JULHour || 0;
            acc.AUGHour += row.AUGHour || 0;
            acc.SEPHour += row.SEPHour || 0;
            acc.OCTHour += row.OCTHour || 0;
            acc.NOVHour += row.NOVHour || 0;
            acc.DECHour += row.DECHour || 0;
            return acc;
        }, { JANHour: 0, FEBHour: 0, MARHour: 0, APRHour: 0, MAYHour: 0, JUNHour: 0, JULHour: 0, AUGHour: 0, SEPHour: 0, OCTHour: 0, NOVHour: 0, DECHour: 0 });
        const currentMonth = parseInt(req.query.currentMonth);

        //Sum the total hours worked from September up to the current month
        let progressHours;
        let countMonth;
        switch(currentMonth){
        case 9:
            progressHours = 0;
            countMonth = 0;
            break;
        case 10:
            progressHours = totals.SEPHour;
            countMonth = 1;
            break;
        case 11:
            progressHours = totals.SEPHour+totals.OCTHour;
            countMonth = 2;
            break;
        case 12:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour;
            countMonth = 3;
            break;
        case 1:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour;
            countMonth = 4;
            break;
        case 2:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour;
            countMonth = 5;
            break;
        case 3:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour+totals.FEBHour;
            countMonth = 6;
            break;
        case 4:    
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour+totals.FEBHour+totals.MARHour;
            countMonth = 7;
            break;
        case 5:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour+totals.FEBHour+totals.MARHour+totals.APRHour;
            countMonth = 8;
            break;
        case 6:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour+totals.FEBHour+totals.MARHour+totals.APRHour+totals.MAYHour;
            countMonth = 9;
            break;
        case 7:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour+totals.FEBHour+totals.MARHour+totals.APRHour+totals.MAYHour+totals.JUNHour;
            countMonth = 10;
            break;
        case 8:
            progressHours = totals.SEPHour+totals.OCTHour+totals.NOVHour+totals.DECHour+totals.JANHour+totals.FEBHour+totals.MARHour+totals.APRHour+totals.MAYHour+totals.JUNHour+totals.JULHour;
            countMonth = 11;
            break;
            }
        //Query the monthly benchmark of the instructor
        const query = `SELECT "sRoleBenchmark" FROM "Profile" WHERE "profileId" = $1;`;
        result = await pool.query(query, [profileId]);
        if (result.rows.length === 0) {
            throw new Error("Profile not found");
        }

        const benchmark = result.rows[0].sRoleBenchmark*countMonth;
        const progressRate = Math.round((progressHours / benchmark) * 100);
        const output = {
        series: [progressRate]
        };
        
        return output;
      
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
    
};
module.exports = {
    getProgress
}
