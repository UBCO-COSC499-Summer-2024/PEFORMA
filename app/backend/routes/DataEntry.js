const pool = require('../db/index');

async function saveDataToDatabase(data) {
    var division = 0;
    if (data.selection === 'Service Role'){
        const seqSyncQuery = `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`;
        await pool.query(seqSyncQuery);
        console.log('data synced');

        const {serviceRoleTitle,serviceRoleDepartment,serviceRoleDescription} = data;
        switch(data.serviceRoleDepartment){
            case 'COSC': division=1;break;
            case 'MATH' : division=2;break;
            case 'PHYS' : division=3;break;
            case 'STAT':division=4;break;
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
            const serviceRoleId = insertResult.rows[0].serviceRoleId;
            //const year = new Date().getUTCFullYear();
            const year = data.serviceRoleYear;
            for (let instructorId of data.selectedInstructors) {
                await pool.query(
                    `INSERT INTO "ServiceRoleAssignment" ("profileId", "serviceRoleId","year")
                     VALUES ($1, $2, $3)`,
                    [instructorId, serviceRoleId,year]
                );
            }
            console.log("Assign prof to service role success.");
        } catch (error) {
            console.log('Error inserting service role:', error.message);
            await pool.query('ROLLBACK');
        }
    }else{
        const seqSyncQuery = `SELECT setval(pg_get_serial_sequence('"Course"', 'courseId'), COALESCE((SELECT MAX("courseId") FROM "Course"), 0) + 1, false);`;
        await pool.query(seqSyncQuery);

        const { courseTitle, courseDepartment, courseCode, courseDescription } = data;
        switch(courseDepartment){
            case 'COSC': division=1; break;
            case 'MATH' : division=2;break;
            case 'PHYS' : division=3;break;
            case 'STAT':division=4;break;
        }
        const values = [courseTitle, courseDescription, division, courseCode];
        const query1 = `INSERT INTO public."Course"(ctitle , description , "divisionId" , "courseNum") VALUES($1, $2, $3, $4) RETURNING "courseId";`;
        const query  = query1;
        console.log(`Add new Course.\n
            Title: ${values[0]}\n
            Department: ${courseDepartment}}\n
            Code: ${values[2]}
            Description: ${values[1]}\n
            `
        );
        try {
            const res = await pool.query(query,values);
            console.log(res);
            console.log("Course Query executed successfully");
            const courseId = res.rows[0].courseId;
            const courseYear = String(data.courseYear);
            const courseTerm = (data.courseTerm);
            const term = Number(courseYear+courseTerm);
            await pool.query( `INSERT INTO "CourseByTerm" ("courseId","term") 
                VALUES ($1, $2)`,[courseId,term]
            );
            console.log("CourseByTeerm table updated.");
            for (let instructorId of data.selectedInstructors) {
                await pool.query(
                    `INSERT INTO "InstructorTeachingAssignment" ("profileId", "courseId","term")
                     VALUES ($1, $2, $3)`,
                    [instructorId, courseId,term]
                );
                console.log("Assign prof to course success.")
            }

        } catch (err) {
            console.log("Error occured when assigning prof to course:\n\t",err);
        }
    }
}

module.exports = {saveDataToDatabase};
