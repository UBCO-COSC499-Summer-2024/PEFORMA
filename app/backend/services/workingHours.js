const {getServiceHour} = require('./serviceHour.js');
async function getWorkingHours(req) {
    const profileId = req.query.profileId;

    try {
        const result = await getServiceHour(profileId);
        //Add the total service hours by month
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
        

        //Formatting the data to designated format
        const currentMonth = parseInt(req.query.currentMonth)-1;
        console.log("CurrentMonth: ", currentMonth);
        let formattedData = [];
        switch(currentMonth){
      case 9:
        formattedData.push({ x: "September", y: totals.SEPHour });
        break;
      case 10:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        break;
      case 11:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        break;
      case 12:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        break;
      case 1:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        break;
      case 2:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        formattedData.push({ x: "February", y: totals.FEBHour });
        break;
      case 3:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        formattedData.push({ x: "February", y: totals.FEBHour });
        formattedData.push({ x: "March", y: totals.MARHour });
        break;
      case 4:
       
      formattedData.push({ x: "September", y: totals.SEPHour });
      formattedData.push({ x: "October", y: totals.OCTHour });
      formattedData.push({ x: "November", y: totals.NOVHour });
      formattedData.push({ x: "December", y: totals.DECHour });
      formattedData.push({ x: "January", y: totals.JANHour });
      formattedData.push({ x: "February", y: totals.FEBHour });
      formattedData.push({ x: "March", y: totals.MARHour });
      formattedData.push({ x: "April", y:totals.APRHour});
            
        break;
      case 5:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        formattedData.push({ x: "February", y: totals.FEBHour });
        formattedData.push({ x: "March", y: totals.MARHour });
        formattedData.push({ x: "April", y:totals.APRHour});
        formattedData.push({ x: "May", y:totals.MAYHour});
        break;
      case 6:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        formattedData.push({ x: "February", y: totals.FEBHour });
        formattedData.push({ x: "March", y: totals.MARHour });
        formattedData.push({ x: "April", y:totals.APRHour});
        formattedData.push({ x: "May", y:totals.MAYHour});
        formattedData.push({ x: "June", y:totals.JUNHour});
        break;
      case 7:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        formattedData.push({ x: "February", y: totals.FEBHour });
        formattedData.push({ x: "March", y: totals.MARHour });
        formattedData.push({ x: "April", y:totals.APRHour});
        formattedData.push({ x: "May", y:totals.MAYHour});
        formattedData.push({ x: "June", y:totals.JUNHour});
        formattedData.push({ x: "July", y:totals.JULHour});
        break;
      case 8:
        formattedData.push({ x: "September", y: totals.SEPHour });
        formattedData.push({ x: "October", y: totals.OCTHour });
        formattedData.push({ x: "November", y: totals.NOVHour });
        formattedData.push({ x: "December", y: totals.DECHour });
        formattedData.push({ x: "January", y: totals.JANHour });
        formattedData.push({ x: "February", y: totals.FEBHour });
        formattedData.push({ x: "March", y: totals.MARHour });
        formattedData.push({ x: "April", y:totals.APRHour});
        formattedData.push({ x: "May", y:totals.MAYHour});
        formattedData.push({ x: "June", y:totals.JUNHour});
        formattedData.push({ x: "July", y:totals.JULHour});
        formattedData.push({ x: "August", y:totals.AUGHour});
        break;
        }
        const output = { data: formattedData };
        return output;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error;
    }
    
};
module.exports = {
    getWorkingHours
}
