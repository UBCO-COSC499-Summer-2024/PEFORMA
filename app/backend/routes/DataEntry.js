const pool = require('../db/index');

async function saveDataToDatabase(data) {
    var division = 0;
    if (data.selection === 'Service Role'){
        const seqSyncQuery = `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`;
        await pool.query(seqSyncQuery);
        console.log('data synced');

        const {serviceRoleTitle,serviceRoleDepartment,serviceRoleDescription} = data;
        switch(data.serviceRoleDepartment){
            case 'CS': division=1;break;
            case 'Mathematics' : division=2;break;
            case 'Physics' : division=3;break;
            case 'Statistics':division=4;
            default: division = 0;
        }
        const values = [serviceRoleTitle,serviceRoleDescription,division]
        console.log(`Add new Service Role.\n
            Title: ${values[0]}\n
            Department: ${serviceRoleDepartment}, id :${values[1]}\n
            Description: ${values[2]}\n
            `
        );

         const insertQuery = `INSERT INTO public."ServiceRole"("stitle", "description", "isActive", "divisionId") VALUES($1, $2, true, $3) RETURNING "serviceRoleId";`;
        //const query = 'INSERT INTO public."ServiceRole"(stitle , description , isActive , divisionId) VALUES($1,$2.$3)';
        
        try {
            const insertResult = await pool.query(insertQuery, values);
            console.log('Inserted Service Role ID:', insertResult.rows[0].serviceRoleId);
        } catch (error) {
            console.error('Error inserting service role:', error.message);
            await pool.query('ROLLBACK');
        }
    }else{
        const seqSyncQuery = `SELECT setval(pg_get_serial_sequence('"Course"', 'courseId'), COALESCE((SELECT MAX("courseId") FROM "Course"), 0) + 1, false);`;
        await pool.query(seqSyncQuery);

        const { courseTitle, courseDepartment, courseCode, courseDescription } = data;
        switch(courseDepartment){
            case 'CS': division=1; break;
            case 'Mathematics' : division=2;break;
            case 'Physics' : division=3;break;
            case 'Statistics':division=4;
        }
        const values = [courseTitle, courseDescription, division, courseCode];
        const query1 = `INSERT INTO public."Course"(ctitle , description , "divisionId" , "courseNum") VALUES($1, $2, $3, $4)`;
        const query  = query1;
        console.log(`Add new Course.\n
            Title: ${values[0]}\n
            Department: ${courseDepartment}, id :${values[1]}\n
            Code: ${values[2]}
            Description: ${values[3]}\n
            `
        );
        try {
            const res = await pool.query(query,values);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = {saveDataToDatabase};