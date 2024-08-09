const xlsx = require('xlsx');
const csv = require('fast-csv');
const fs = require('fs');
const Joi = require('joi');
const pool = require('../db/index.js');
const { updateTeachingPerformance} = require('./CourseEvaluation/courseEvaluation.js');
const { title } = require('process');

// --- Validation Schemas --- 

const profileSchema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().allow(null, ''),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNum: Joi.string().allow(null, ''),
    officeBuilding: Joi.string().allow(null, ''),
    officeNum: Joi.any().allow(null, ''),
    position: Joi.string().allow(null, ''),
    divisionId: Joi.number().integer().allow(null, ''),
    UBCId: Joi.string().length(8).allow(null, ''),
    serviceHourCompleted: Joi.number().allow(null, ''),
    sRoleBenchmark: Joi.number().integer().allow(null, '')
});

const courseSchema = Joi.object({
    ctitle: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    divisionId: Joi.number().integer().required(),
    courseNum: Joi.number().integer().required(),
});

const serviceRoleAssignmentSchema = Joi.object({
    UBCID: Joi.number().integer().required(),
    ServiceTitle: Joi.string().required(),
    year: Joi.number().integer().required(),
});

const serviceRoleWithYearSchema = Joi.object({
    stitle: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    divisionId: Joi.number().integer().required(),
    year: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
    JANHour: Joi.number().min(0).allow(null),
    FEBHour: Joi.number().min(0).allow(null),
    MARHour: Joi.number().min(0).allow(null),
    APRHour: Joi.number().min(0).allow(null),
    MAYHour: Joi.number().min(0).allow(null),
    JUNHour: Joi.number().min(0).allow(null),
    JULHour: Joi.number().min(0).allow(null),
    AUGHour: Joi.number().min(0).allow(null),
    SEPHour: Joi.number().min(0).allow(null),
    OCTHour: Joi.number().min(0).allow(null),
    NOVHour: Joi.number().min(0).allow(null),
    DECHour: Joi.number().min(0).allow(null)
});

const teachingAssignmentSchema = Joi.object({
    term: Joi.number().integer().required(),
    division: Joi.string().required(),
    courseNum: Joi.number().integer().required(),
    UBCID: Joi.number().integer().required(),
});

const SEIDataSchema = Joi.object({
     surveyTypeId : Joi.number().integer().required(),
     surveyQuestionId: Joi.number().integer().required(),
     courseId: Joi.number().integer().required(),
     term: Joi.number().integer().required(),
     UBCId: Joi.number().integer().required(),
     response: Joi.string().allow(null,''),
 });

const CoursePerformanceDataSchema = Joi.object({
    courseId: Joi.number().integer().required(),
    term:Joi.number().integer().required(),
    profileId:Joi.number().integer().required(),
    SEIQ1:Joi.number().precision(2).allow(null,''),
    SEIQ2:Joi.number().precision(2).allow(null,''),
    SEIQ3:Joi.number().precision(2).allow(null,''),
    SEIQ4:Joi.number().precision(2).allow(null,''),
    SEIQ5:Joi.number().precision(2).allow(null,''),
    SEIQ6:Joi.number().precision(2).allow(null,''),
    retentionRate:Joi.number().precision(2).required(),
    failRate:Joi.number().precision(2).required(),
    enrolRate:Joi.number().precision(2).required(),
    averageGrade:Joi.number().precision(2).required(),
});

const meetingUploadSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    expected: Joi.string().required()
});

const taAssignmentSchema = Joi.object({
    term: Joi.number().integer().required(),
    UBCId: Joi.string().length(8).required(),
    firstName: Joi.string().required(),
    middleName: Joi.string().allow(null, ''),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    courseId: Joi.number().integer().required()
});
// Main function to import data from multiple files
async function importData(files) {
    const maxRetries = files.length+1; // Max retries based on number of files
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); //Begin db connection
        
        let importedCount = 0;
        let errors = [];
        let retries = 0;
        let remainingFiles = [];
        
        console.log("\n\nStart importing.");

        while (files.length > 0 && retries < maxRetries) {
        // Process each file in the files array
            for (const file of files) {
                try {
                    const fileData = await processFile(file, client);
                    importedCount += fileData.length;
                } catch (error) {
                    console.error(`Error processing file: ${file.originalname}\n`, error.message);
                    remainingFiles.push({ file: file, error: error.message });
                }
            }
            files = remainingFiles.map(f => f.file);  // Update files array with remaining files
            retries++;
        }

        await client.query('COMMIT'); //Commit if successful

        if (files.length > 0) {
            errors = remainingFiles;
        }

        return { 
            success: errors.length === 0,
            importedCount, 
            errors
        };
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction if error occurs
        console.error('Transaction failed and rolled back:', error.message);
        throw error;
    } finally {
        client.release();
    }
}
// Function to process a  file
async function processFile(file, client) {
    const filePath = file.path;
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    let data = [];

    if (fileExtension === 'xlsx') {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (fileExtension === 'csv') {
        data = await new Promise((resolve, reject) => {
            const parsedData = [];
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on('data', row => parsedData.push(row))
                .on('end', () => resolve(parsedData))
                .on('error', error => reject(error));
        });
    } else {
        throw new Error('Unsupported file format');
    }

    let importedData = [];

    for (const row of data) {
        try {
            await processRow(row, client);
            importedData.push(row);
        } catch (error) {
            console.error('Error processing row:', error.message);
            throw new Error(`Error processing row: ${error.message}`);
        }
    }

    return importedData;
}

async function processRow(row, client) {
    // upload to profile table
    if ('firstName' in row && 'lastName' in row && !('TA_Term' in row) ) {    
        await processProfileData(row, client);
    } 

    // upload to course table
    else if ('ctitle' in row && 'courseNum' in row) {   
        await processCourseData(row, client);
    } 

    // upload to serviceRole-by-year table
    else if ('stitle' in row && 'year' in row) {    
        await processServiceRoleData(row, client);
    } 

    // upload to Instructor-Teaching-Assignment table
    else if ('term' in row && 'division' in row && 'courseNum' in row && 'UBCID' in row) {
        await processTeachingAssignmentData(row, client);
    } 

     // upload to Service-Role-Assignment table
    else if ('UBCID' in row && 'ServiceTitle' in row && 'year' in row) {
       await processServiceRoleAssignmentData(row, client);
    } 

    // upload to Survey-Question-Response table   
    else if ( 'QuestionNum' in row && 'CourseId' in row && 'Term' in row && 'UBCId' in row && 'Response' in row ) {
        await processSEIData(row,client);
    }

    // upload to Course-Performance table    
    else if ( 'CourseId' in row && 'Term' in row && 'SEIQ1' in row) {
         await processCoursePerformanceData(row,client);
    } 

    else if( 'location' in row && 'date' in row && 'time' in row && "expected" in row){
        console.log('Process Meeting upload.');
        await processUploadMeetingData(row,client);
    }
    
    else if ('TA_Term' in row && 'UBCId' in row && 'firstName' in row && 'lastName' in row && 'email' in row && 'courseId' in row) {
        console.log("Process TA assign.");  
        await processTaAssignmentData(row, client);
    } 
    else {
        throw new Error('Unknown data type');
    }
}
// Function to process service role data
async function processProfileData(row, client) {
    const profileData = {
        firstName: row.firstName || null,
        middleName: row.middleName || null,
        lastName: row.lastName || null,
        email: row.email || null,
        phoneNum: row.phoneNum || null,
        officeBuilding: row.officeBuilding || null,
        officeNum: row.officeNum || null,
        position: row.position || null,
        divisionId: row.divisionId || null,
        UBCId: String(row.UBCId) || null,
        serviceHourCompleted: row.serviceHourCompleted || 0,
        sRoleBenchmark: row.sRoleBenchmark || 0
    };

    const { error } = profileSchema.validate(profileData);
    if (error) {
        console.error('Profile data validation error:', error.message);
        throw new Error(`Profile data validation error: ${error.message}`);
    }

    try {
        await client.query(`
            INSERT INTO public."Profile" (
                "firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT ("email") DO UPDATE SET 
                "firstName" = EXCLUDED."firstName",
                "middleName" = EXCLUDED."middleName",
                "lastName" = EXCLUDED."lastName",
                "phoneNum" = EXCLUDED."phoneNum",
                "officeBuilding" = EXCLUDED."officeBuilding",
                "officeNum" = EXCLUDED."officeNum",
                "position" = EXCLUDED."position",
                "divisionId" = EXCLUDED."divisionId",
                "serviceHourCompleted" = EXCLUDED."serviceHourCompleted",
                "sRoleBenchmark" = EXCLUDED."sRoleBenchmark"
        `, Object.values(profileData)); //insert into profile table
    } catch (err) {
        console.error('Error inserting/updating profile data:', err.message);
        throw err;
    }
}
//Function to process course data
async function processCourseData(row, client) {
    const courseData = {
        ctitle: row.ctitle || null,
        description: row.description || null,
        divisionId: row.divisionId || null,
        courseNum: row.courseNum || null
    };

    const { error } = courseSchema.validate(courseData);
    if (error) {
        console.error('Course data validation error:', error.message);
        throw new Error(`Course data validation error: ${error.message}`);
    }

    try { 
        await client.query(`
            INSERT INTO public."Course" ("ctitle", "description", "divisionId", "courseNum")
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("ctitle") DO UPDATE SET
                "description" = EXCLUDED."description",
                "divisionId" = EXCLUDED."divisionId",
                "courseNum" = EXCLUDED."courseNum"
        `, Object.values(courseData)); //Insert into course table
    } catch (err) {
        console.error('Error inserting/updating course data:', err.message);
        throw err;
    }
}
//Function to process service role data
async function processServiceRoleData(row, client) {
    const cleanedRow = {};
    for (const key in serviceRoleWithYearSchema.describe().keys) {
        cleanedRow[key] = row[key] || null;
    }

    const { error, value } = serviceRoleWithYearSchema.validate(cleanedRow);
    if (error) {
        throw new Error(`Service role data validation error: ${error.message}`);
    }
    //Insert into service role table
    const serviceRoleResult = await client.query(`
        INSERT INTO public."ServiceRole" ("stitle", "description", "isActive", "divisionId")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("stitle", "divisionId") DO UPDATE SET
        "description" = EXCLUDED."description",
        "divisionId" = EXCLUDED."divisionId"
        RETURNING "serviceRoleId"
    `, [value.stitle, value.description, true, value.divisionId]);

    const serviceRoleId = serviceRoleResult.rows[0].serviceRoleId;

    const months = ['JANHour', 'FEBHour', 'MARHour', 'APRHour', 'MAYHour', 'JUNHour', 'JULHour', 'AUGHour', 'SEPHour', 'OCTHour', 'NOVHour', 'DECHour'];
    const values = [serviceRoleId, value.year];
    months.forEach(month => {
        values.push(value[month] || 0);
    });

    await client.query(`
        INSERT INTO public."ServiceRoleByYear" ("serviceRoleId", "year", "JANHour", "FEBHour", "MARHour", "APRHour", "MAYHour", "JUNHour", "JULHour", "AUGHour", "SEPHour", "OCTHour", "NOVHour", "DECHour")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT ("serviceRoleId", "year") DO UPDATE SET
        "JANHour" = EXCLUDED."JANHour",
        "FEBHour" = EXCLUDED."FEBHour",
        "MARHour" = EXCLUDED."MARHour",
        "APRHour" = EXCLUDED."APRHour",
        "MAYHour" = EXCLUDED."MAYHour",
        "JUNHour" = EXCLUDED."JUNHour",
        "JULHour" = EXCLUDED."JULHour",
        "AUGHour" = EXCLUDED."AUGHour",
        "SEPHour" = EXCLUDED."SEPHour",
        "OCTHour" = EXCLUDED."OCTHour",
        "NOVHour" = EXCLUDED."NOVHour",
        "DECHour" = EXCLUDED."DECHour"
    `, values);
}
//Function to process service role assignment data
async function processServiceRoleAssignmentData(row, client) {
    console.log(row);
    const assignmentData = {
        UBCID: String(row.UBCID),
        ServiceTitle: row.ServiceTitle,
        year: row.year,
    };

    const { error } = serviceRoleAssignmentSchema.validate(assignmentData);
    if (error) {
        console.log(`Validation Error: ${error.message}`);
        throw new Error(`Service role assignment data validation error: ${error.message}`);
    }

    try {
        // Get profileId from UBCID
        const profileResult = await client.query(`
            SELECT "profileId" FROM public."Profile" WHERE "UBCId" = $1
        `, [assignmentData.UBCID]);

        if (profileResult.rows.length === 0) {
            console.log(`Profile not found for UBCID ${assignmentData.UBCID}`);
            throw new Error(`Profile not found for UBCID ${assignmentData.UBCID}`);
        }
        const profileId = profileResult.rows[0].profileId;

        // Get serviceRoleId from ServiceTitle
        const serviceRoleResult = await client.query(`
            SELECT "serviceRoleId" FROM public."ServiceRole" WHERE "stitle" = $1
        `, [assignmentData.ServiceTitle]);

        if (serviceRoleResult.rows.length === 0) {
            console.log(`Service role not found: ${assignmentData.ServiceTitle}`);
            throw new Error(`Service role not found: ${assignmentData.ServiceTitle}`);
        }
        const serviceRoleId = serviceRoleResult.rows[0].serviceRoleId;

        // Insert into ServiceRoleAssignment
        await client.query(`
            INSERT INTO public."ServiceRoleAssignment" ("profileId", "serviceRoleId", "year")
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
        `, [profileId, serviceRoleId, assignmentData.year]);
    } catch (err) {
        console.log(`Error processing service role assignment: ${err.message}`);
        throw err;
    }
}
//Function to process SEI data
async function processSEIData(row,client) {
    const SEIData = {
        surveyTypeId : 1,
        surveyQuestionId: Number(row.QuestionNum),
        courseId: Number(row.CourseId),
        term: Number(row.Term),
        UBCId: String(row.UBCId),
        response: String(row.Response),
    };
    const { error } = SEIDataSchema.validate(SEIData);
    if (error) {
        console.log(`Validation Error: ${error.message}`);
        throw new Error(`SEI data validation error: ${error.message}`);
    }

    try {
        // Get profileId from UBCID
        const profileResult = await client.query(`
            SELECT "profileId" FROM public."Profile" WHERE "UBCId" = $1
        `, [SEIData.UBCId]);
        if (profileResult.rows.length === 0) {
            throw new Error(`Profile not found for UBCID ${SEIData.UBCId}`);
        }
        const profileId = profileResult.rows[0].profileId;

        // Insert into Survey-Question-Response table
        await client.query(`
            INSERT INTO public."SurveyQuestionResponse" 
            ("surveyTypeId", "surveyQuestionId" , "courseId", "term", "profileId" ,"studentId" , "response")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT DO NOTHING
        `, [
            SEIData.surveyTypeId,
            SEIData.surveyQuestionId,
            SEIData.courseId,
            SEIData.term,
            profileId,
            null,
            SEIData.response]);
        console.log('SEI data import success.');
    } catch (err) {
        console.log(`Error processing SEI data: ${err.message}`);
        throw err;
    }
}
//Function to process course performance data
async function processCoursePerformanceData (row,client){
    console.log("\n\n\nCourse Performance import data:",row);
    const coursePerformanceData = {
        courseId: Number(row.CourseId),
        term:Number(row.Term),
        SEIQ1:Number(row.SEIQ1),
        SEIQ2:Number(row.SEIQ2),
        SEIQ3:Number(row.SEIQ3),
        SEIQ4:Number(row.SEIQ4),
        SEIQ5:Number(row.SEIQ5),
        SEIQ6:Number(row.SEIQ6),
        profileId:Number(row.profileId),
        retentionRate:Number(row.retentionRate),
        failRate:Number(row.failRate),
        enrolRate:Number(row.enrolRate),
        averageGrade:Number(row.averageGrade),
    };
    const {error} = CoursePerformanceDataSchema.validate(coursePerformanceData);
    if (error) {
        console.log(`Validation Error: ${error.message}`);
        throw new Error(`Course Performance data validation error: ${error.message}`);
    };

    try {
        // Insert into Survey-Question-Response table
        await client.query(`
            INSERT INTO public."CourseEvaluation" ("courseId", "term" , "profileId", "SEIQ1", "SEIQ2" ,"SEIQ3" , "SEIQ4" , "SEIQ5" , "SEIQ6" , "retentionRate" , "failRate" , "enrolRate" , "averageGrade")
            VALUES ($1, $2, $3, $4, $5, $6, $7 , $8, $9, $10, $11, $12, $13)
            ON CONFLICT DO NOTHING
        `, [
            coursePerformanceData.courseId,
            coursePerformanceData.term,
            coursePerformanceData.profileId,
            coursePerformanceData.SEIQ1,
            coursePerformanceData.SEIQ2,
            coursePerformanceData.SEIQ3,
            coursePerformanceData.SEIQ4,
            coursePerformanceData.SEIQ5,
            coursePerformanceData.SEIQ6,
            coursePerformanceData.retentionRate,
            coursePerformanceData.failRate,
            coursePerformanceData.enrolRate,
            coursePerformanceData.averageGrade
        ]);
        await updateTeachingPerformance(coursePerformanceData.courseId,
            coursePerformanceData.term,
            coursePerformanceData.profileId,
            coursePerformanceData.SEIQ1,
            coursePerformanceData.SEIQ2,
            coursePerformanceData.SEIQ3,
            coursePerformanceData.SEIQ4,
            coursePerformanceData.SEIQ5,
            coursePerformanceData.SEIQ6,
            coursePerformanceData.retentionRate,
            coursePerformanceData.failRate,
            coursePerformanceData.enrolRate,
            coursePerformanceData.averageGrade);

    } catch (err) {
        console.log(`Error processing Course Performance data: ${err.message}`);
        throw err;
    }
}
//Function to process teaching assignment data
async function processTeachingAssignmentData(row, client) {
    const assignmentData = {
        term: row.term,
        division: row.division,
        courseNum: row.courseNum,
        UBCID: row.UBCID,
    };

    const { error } = teachingAssignmentSchema.validate(assignmentData);
    if (error) {
        throw new Error(`Teaching assignment data validation error: ${error.message}`);
    }

    try {
        // Get divisionId from division code
        const divisionResult = await client.query(`
            SELECT "divisionId" FROM public."Division" WHERE "dcode" = $1
        `, [assignmentData.division]);

        if (divisionResult.rows.length === 0) {
            console.log(`Division not found: ${assignmentData.division}`);
            throw new Error(`Division not found: ${assignmentData.division}`);
        }
        const divisionId = divisionResult.rows[0].divisionId;

        // Get courseId from divisionId and courseNum
        const courseResult = await client.query(`
            SELECT "courseId" FROM public."Course" WHERE "divisionId" = $1 AND "courseNum" = $2
        `, [divisionId, assignmentData.courseNum]);

        if (courseResult.rows.length === 0) {
            throw new Error(`Course not found for division ${assignmentData.division} and courseNum ${assignmentData.courseNum}`);
        }
        const courseId = courseResult.rows[0].courseId;

        // Ensure CourseByTerm entry exists
        await client.query(`
            INSERT INTO public."CourseByTerm" ("courseId", "term")
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [courseId, assignmentData.term]);

        // Get profileId from UBCID
        const profileResult = await client.query(`
            SELECT "profileId" FROM public."Profile" WHERE "UBCId" = $1
        `, [assignmentData.UBCID]);

        if (profileResult.rows.length === 0) {
            throw new Error(`Profile not found for UBCID ${assignmentData.UBCID}`);
        }
        const profileId = profileResult.rows[0].profileId;

        // Insert into InstructorTeachingAssignment
        await client.query(`
            INSERT INTO public."InstructorTeachingAssignment" ("profileId", "courseId", "term")
            VALUES ($1, $2, $3)
            ON CONFLICT ("profileId", "courseId", "term") DO NOTHING
        `, [profileId,
            courseId,
            assignmentData.term]);
    } catch (err) {
        console.log(`Error processing assignment: ${err.message}`);
        throw err;
    }
}
//Function to process meeting log data
async function processMeetingLogData(row, client) {
    const meetingLogData = {
        meetingTitle: row.title || null,
        location: row.location || null,
        date: String(row.date) || null,
        time: row.time || null
    };

    const { error } = meetingLogSchema.validate(meetingLogData);
    if (error) {
        console.error('Meeting log data validation error:', error.message);
        throw new Error(`Meeting log data validation error: ${error.message}`);
    }

    try {
        await client.query(`
            INSERT INTO public."MeetingLog" ("meetingTitle", "location", "date", "time")
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
        `, Object.values(meetingLogData));
    } catch (err) {
        console.error('Error inserting meeting log data:', err.message);
        throw err;
    }
}
//function to process meeting attendance data
async function processMeetingAttendanceData(row, client) {
    const meetingAttendanceData = {
        meetingId: row.meetingId || null,
        UBCId: String(row.UBCId) || null
    };

    const { error } = meetingAttendanceSchema.validate(meetingAttendanceData);
    if (error) {
        console.error('Meeting attendance data validation error:', error.message);
        throw new Error(`Meeting attendance data validation error: ${error.message}`);
    }

    try {
        await client.query(`
            INSERT INTO public."MeetingAttendance" ("meetingId", "UBCId")
            VALUES ($1, $2)
            ON CONFLICT ("meetingId", "UBCId")
        `, Object.values(meetingAttendanceData)); //Insert into meeting attendance table
    } catch (err) {
        console.error('Error inserting/updating meeting attendance data:', err.message);
        throw err;
    }
}
//Function to process ta assigment data
async function processTaAssignmentData(row, client) {
    const taAssignmentData = {
        term: row.TA_Term,
        UBCId: String(row.UBCId) || null,
        firstName: row.firstName,
        middleName: row.middleName || null,
        lastName: row.lastName,
        email: row.email || null,
        courseId: row.courseId || null
    };
    const { error } = taAssignmentSchema.validate(taAssignmentData);
    if (error) {
        console.error('TA assignment data validation error:', error.message);
        throw new Error(`TA assignment data validation error: ${error.message}`);
    }

    try {
        await client.query(`
            INSERT INTO public."TaAssignmentTable" ("term", "UBCId", "firstName", "middleName", "lastName", "email", "courseId")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT ("term", "courseId") DO UPDATE SET
                "firstName" = EXCLUDED."firstName",
                "middleName" = EXCLUDED."middleName",
                "lastName" = EXCLUDED."lastName",
                "email" = EXCLUDED."email"
        `, Object.values(taAssignmentData)); //Insert into TA assignment table
    } catch (err) {
        console.error('Error inserting/updating TA assignment data:', err.message);
        throw err;
    }
}
//Function to process meeting data
async function processUploadMeetingData(row, client) {
    var res1 = await client.query(`SELECT * FROM "MeetingLog"`);
    console.log("All meetingLogs\n",res1);
    const meetingLogData = {
        title: row.title || null,
        location: row.location || null,
        date: String(row.date) || null,
        time: String(row.time) || null,
        expected: row.expected || null
    };
    const { error } = meetingUploadSchema.validate(meetingLogData);
    if (error) {
        console.error('Meeting log data validation error:', error.message);
        throw new Error(`Meeting log data validation error: ${error.message}`);
    }
    var meetingId;
    try {
        // create meeting in meetingLog table
        var result = await client.query(`
            INSERT INTO public."MeetingLog" ("meetingTitle", "location", "date", "time")
            VALUES ($1, $2, $3, $4)
        `, [meetingLogData.title,meetingLogData.location,meetingLogData.date,meetingLogData.time]);
        meetingId = await client.query(`
            SELECT "meetingId" FROM "MeetingLog"
            WHERE   "meetingTitle" = $1
                AND "location" = $2
                AND "date" = $3
                AND "time" = $4
        `, [meetingLogData.title,meetingLogData.location,meetingLogData.date,meetingLogData.time]);
        console.log("\n\nResult of inserting meeting log.\n",result,"\nMeeting id=",meetingId);
    } catch (err) {
        console.error('Error inserting meeting log data:', err.message);
        throw err;
    }
    console.log('Meeting created successfully for ',meetingLogData.title,"\nMeeting id: ",meetingId);
    var expected_people = String(meetingLogData.expected).split(',')
    try{
        for(let i=0;i<expected_people.length;i++){
            console.log('Insert UBCID: ',expected_people[i],' into meetingId: ',meetingId.rows[0].meetingId);
            // this is the i-th object for ubcid person
            await client.query(`
                INSERT INTO public."MeetingAttendance" ("meetingId", "UBCId")
                VALUES ($1, $2)
                ON CONFLICT ("meetingId", "UBCId") DO NOTHING
            `,[meetingId.rows[0].meetingId,expected_people[i]]);
        }
    }catch(err){
        console.log('Error inserting meeting attandence data:',err.message);
    }
}

module.exports = {
    importData
};
