const pool = require('../db/index');

async function saveDataToDatabase(data) {
    var division = 0;
    let query;
    let result;
    if (data.selection === 'Service Role'){
        const {serviceRoleTitle,serviceRoleDepartment,serviceRoleDescription} = data;
        switch(data.serviceRoleDepartment){
            case 'COSC': division=1;break;
            case 'MATH' : division=2;break;
            case 'PHYS' : division=3;break;
            case 'STAT':division=4;break;
            default: division = 0;
        }
        const values = [serviceRoleTitle,serviceRoleDescription,division];
        query = `SELECT * FROM "ServiceRole" WHERE "divisionId" = $1 AND "stitle" = $2;`;
        result = await pool.query(query,[division,serviceRoleTitle]);
        if(result.rows.length > 0){
            throw new Error;
        }
        query = `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`;
        await pool.query(query);
        query = `INSERT INTO public."ServiceRole"("stitle", "description", "isActive", "divisionId") VALUES($1, $2, true, $3) RETURNING "serviceRoleId";`;        
        try {
            const insertResult = await pool.query(query, values);
            return insertResult;
        } catch (error) {
            console.log('Error inserting service role:', error.message);
            await pool.query('ROLLBACK');
        }
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
            throw new Error;
        }
        query = `SELECT setval(pg_get_serial_sequence('"Course"', 'courseId'), COALESCE((SELECT MAX("courseId") FROM "Course"), 0) + 1, false);`;
        await pool.query(query);
        const values = [courseTitle, courseDescription, division, courseCode];
        query = `INSERT INTO public."Course"(ctitle , description , "divisionId" , "courseNum") VALUES($1, $2, $3, $4) RETURNING "courseId";`;
        try{
            const data = await pool.query(query,values);
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
