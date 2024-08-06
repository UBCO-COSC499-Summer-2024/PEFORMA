const pool = require('../db/index');

async function saveDataToDatabase(data) {
    let division;
    let query;
    let result;
    //If the user clicks service role
    if (data.selection === 'Service Role'){
        const {serviceRoleTitle,serviceRoleDepartment,serviceRoleDescription} = data;
        //convert the user input to corresponding divisionId
        switch(serviceRoleDepartment){
            case 'COSC': division=[1];break;
            case 'MATH': division=[2];break;
            case 'PHYS': division=[3];break;
            case 'STAT':division=[4];break;
            case 'All' : division = [1,2,3,4];break;
            default: division = [];
        }
        //Check if service role already exists
        query = `SELECT * FROM "ServiceRole" WHERE "divisionId" = ANY($1) AND "stitle" = $2;`;
        result = await pool.query(query,[division,serviceRoleTitle]);
        if(result.rows.length > 0){
            throw new Error("Service Role already exist");
        }
        await pool.query('BEGIN');
        for(let div of division){
            //Data for the soon to be inserted data
            const values = [serviceRoleTitle,serviceRoleDescription,true,div];
            //Manual increment 
            query = `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`;
            await pool.query(query);
            //Insert the data 
            query = `INSERT INTO public."ServiceRole"("stitle", "description", "isActive", "divisionId") VALUES($1, $2, $3, $4) RETURNING "serviceRoleId";`;        
            try {
                await pool.query(query, values);

            } catch (error) {
                console.log('Error inserting service role:', error.message);
                await pool.query('ROLLBACK');
                throw error;
            }

        }
        await pool.query('COMMIT');
    //For course creation
    }else{

        const { courseTitle, courseDepartment, courseCode, courseDescription } = data;
        //convert the user input to corresponding divisionId
        switch(courseDepartment){
            case 'COSC': division=1; break;
            case 'MATH' : division=2;break;
            case 'PHYS' : division=3;break;
            case 'STAT':division=4;break;
        }
        //Check if course alaready exists
        query = `SELECT * FROM "Course" WHERE "divisionId" = $1 AND "courseNum" = $2; `;
        result = await pool.query(query, [division, courseCode]);
        if(result.rows.length > 0){
            throw new Error("Course already exist");
        }
        //Manual increment of the courseid
        query = `SELECT setval(pg_get_serial_sequence('"Course"', 'courseId'), COALESCE((SELECT MAX("courseId") FROM "Course"), 0) + 1, false);`;
        await pool.query(query);
        await pool.query('BEGIN');
        //Prep the soon to be inserted data
        const values = [courseTitle, courseDescription, division, courseCode];
        //Insert data
        query = `INSERT INTO public."Course"(ctitle , description , "divisionId" , "courseNum", "isActive") VALUES($1, $2, $3, $4, true) RETURNING "courseId";`;
        try{
            const data = await pool.query(query,values);
            await pool.query('COMMIT');
            return data;
        }
        catch(error){
            await pool.query('ROLLBACK');
            throw error;
        }
    }
}

module.exports = {saveDataToDatabase};
