const  pool = require('../../db/index.js');
const { getLatestYear } = require('../latestYear.js');

async function getBenchmark(){
    try{
        const date = new Date();
        const currMonth = date.getMonth() +1;
        const currentMonth =currMonth;
        let query;
        //Retrieve the latest year
        const year = await getLatestYear();
        //Retrieve the total serice hours grouped by serviceroleId
        if(currentMonth == 10){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth ==11 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth == 12 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth == 1 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth ==2 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+ srb."JanHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth ==3 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+srb."JANHour"+srb."FEBHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth ==4 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+srb."JANHour"+srb."FEBHour"+srb."MARHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth == 5 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+srb."JANHour"+srb."FEBHour"+srb."MARHour"+srb."APRHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth == 6 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+srb."JANHour"+srb."FEBHour"+srb."MARHour"+srb."APRHour"+srb."MAYHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth == 7 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+srb."JANHour"+srb."FEBHour"+srb."MARHour"+srb."APRHour"+srb."MAYHour"+srb."JUNHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else if(currentMonth == 8 ){
            query = `SELECT 
                    p."profileId",
                    p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName" AS full_name,
                    p."sRoleBenchmark",
                    SUM(srb."SEPHour"+srb."OCTHour"+srb."NOVHour"+srb."DECHour"+srb."JANHour"+srb."FEBHour"+srb."MARHour"+srb."APRHour"+srb."MAYHour"+srb."JUNHour"+srb."JULHour") AS total_hours
                    FROM 
                    "ServiceRoleByYear" srb
                    JOIN 
                    "ServiceRoleAssignment" sra ON srb."serviceRoleId" = sra."serviceRoleId" AND srb."year" = sra."year"
                    JOIN 
                    "Profile" p ON sra."profileId" = p."profileId"
                    WHERE 
                    srb."year" = $1
                    GROUP BY 
                    p."profileId", p."firstName", p."middleName", p."lastName", p."sRoleBenchmark";
                    `;
        }
        else{
            throw new Error("No benchmark data");
        }
        result = await pool.query(query,[year]);
        let countMonth = 0;
        switch(currentMonth){
            case 9: countMonth = 0; break;
            case 10: countMonth = 1; break;
            case 11: countMonth = 2; break;
            case 12: countMonth = 3; break;
            case 1: countMonth = 4; break;
            case 2: countMonth = 5; break;
            case 3: countMonth = 6; break;
            case 4: countMonth = 7; break;
            case 5: countMonth = 8; break;
            case 6: countMonth = 9; break;
            case 7: countMonth = 10; break;
            case 8: countMonth = 11; break;
        }
        //Check if benchmark is less than totalServiceHour
        const serviceList = result.rows.filter(row => row.total_hours < row.sRoleBenchmark * countMonth).map(row => ({
            name: row.full_name,
            shortage: row.sRoleBenchmark * countMonth - row.total_hours
        }));
        const output = {
            people:serviceList
        }
        return output;        
        
    }
    catch(error){
        throw error;
    }

};
module.exports = {
    getBenchmark
}