const pool = require('../db/index');

async function saveDataToDatabase(data) {
    let division;
    let query;
    let result;
    console.log(data);
    if (data.selection === 'Service Role'){
        const {serviceRoleTitle,serviceRoleDepartment,serviceRoleDescription} = data;
        switch(serviceRoleDepartment){
            case 'COSC': division=[1];break;
            case 'MATH': division=[2];break;
            case 'PHYS': division=[3];break;
            case 'STAT':division=[4];break;
            case 'All' : division = [1,2,3,4];break;
            default: division = [];
        }
        query = `SELECT * FROM "ServiceRole" WHERE "divisionId" = ANY($1) AND "stitle" = $2;`;
        result = await pool.query(query,[division,serviceRoleTitle]);
        if(result.rows.length > 0){
            throw new Error("Service Role already exist");
        }
        await pool.query('BEGIN');
        for(let div of division){
            const values = [serviceRoleTitle,serviceRoleDescription,true,div];
            query = `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`;
            await pool.query(query);
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
    }else{

        const { courseTitle, courseDepartment, courseCode, courseDescription } = data;
        switch(courseDepartment){
            case 'COSC': division=1; break;
            case 'MATH' : division=2;break;
            case 'PHYS' : division=3;break;
            case 'STAT':division=4;break;
        }
        query = `SELECT * FROM "Course" WHERE "divisionId" = $1 AND "courseNum" = $2; `;
        result = await pool.query(query, [division, courseCode]);
        if(result.rows.length > 0){
            throw new Error("Course already exist");
        }
        query = `SELECT setval(pg_get_serial_sequence('"Course"', 'courseId'), COALESCE((SELECT MAX("courseId") FROM "Course"), 0) + 1, false);`;
        await pool.query(query);
        await pool.query('BEGIN');
        const values = [courseTitle, courseDescription, division, courseCode];
        query = `INSERT INTO public."Course"(ctitle , description , "divisionId" , "courseNum", "isActive") VALUES($1, $2, $3, $4, true) RETURNING "courseId";`;
        try{
            const data = await pool.query(query,values);
            await pool.query('COMMIT');
            return data;
        }
        catch(error){
            console.log("Error executing insert function");
            await pool.query('ROLLBACK');
            throw error;
        }
    }
}

module.exports = {saveDataToDatabase};
