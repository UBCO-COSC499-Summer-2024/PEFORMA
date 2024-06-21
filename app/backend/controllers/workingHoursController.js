const  pool = require('../db/index.js'); // Adjust the path as necessary for your db connection
console.log(pool); // See what pool actually is

exports.getWorkingHours = async (req, res) => {
    const profileId = req.query.profileId;
    //console.log("UBC ID is: ",ubcId); 
    console.log("ProfileID is: ", profileId);


    //Working hours
    //January to December working hours and AVG working hour
    try {
        //Get the latest year
        let query = `SELECT "year" FROM "ServiceRoleAssignment" ORDER BY "year" DESC;`;
        //let result = await pool.query(query, [id]);
        let result = await pool.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const year = result.rows[0].year;

        console.log("Latest year: ",year);


        // Extract service role performance
        query = `
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
            return res.status(404).json({ message: 'User not found' });
        }
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
        
        // Now you can use `totals` to access the summed values
        //console.log("Total Hour for each month is: ",totals);  // Log the summed hours for each month
       
        //Retrieve Average Working Hour for all the service roles in specific division
        const avgWorkHour = {
            JANHour: 100,
            FEBHour: 140,
            MARHour: 125,
            APRHour: 140,
            MAYHour: 40,
            JUNHour: 60,
            JULHour: 40,
            AUGHour: 80,
            SEPHour: 10,
            OCTHour: 110,
            NOVHour: 125,
            DECHour: 130
        };

        //Formatting the data to designated format
        const currentMonth = parseInt(req.query.currentMonth);
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
        console.log("Output :", formattedData);
        const output = { data: formattedData };
        res.json(output);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
