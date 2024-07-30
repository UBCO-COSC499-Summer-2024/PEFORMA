const  pool = require('../db/index.js');
const { getLatestTerm } = require('./latestTerm.js');
console.log(pool); 

async function getCourseHistory(req) {
    const latestTermResult = await getLatestTerm();
    const courseId = req.query.courseId;  
    try {
        let query = `
        SELECT 
            c."ctitle", 
            c."description", 
            d."dcode" || ' ' || c."courseNum" AS "courseCode", 
            d."dname"
        FROM 
            "Course" c 
        LEFT JOIN 
            "Division" d ON d."divisionId" = c."divisionId"
        WHERE 
            c."courseId" = $1
`;
        let result = await pool.query(query,[courseId]);
        // Extract course details from the first result row
        const { ctitle, description, courseCode, dname } = result.rows[0];
        //Join profile, course, instructorassignment, single teaching performance tables
        query = `SELECT ita."term", TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name,
                 COALESCE(stp."score", '0') AS score, p."profileId", p."UBCId", ita."location", ita."enrollment",ita."meetingPattern" FROM "Course" c
                LEFT JOIN
                "InstructorTeachingAssignment" ita ON c."courseId" = ita."courseId"
                LEFT JOIN
                "SingleTeachingPerformance" stp ON stp."courseId" = ita."courseId" AND stp."term" = ita."term" AND stp."profileId" = ita."profileId"
                LEFT JOIN
                "Profile" p ON p."profileId" = ita."profileId"
                LEFT JOIN 
                "Division" d ON d."divisionId" = c."divisionId"
                WHERE 
                c."courseId" = $1 AND ita."term" <= $2
                ORDER BY 
                ita."term", full_name, p."profileId", p."UBCId", stp."score" DESC;
        `;
        result = await pool.query(query,[courseId,latestTermResult]);
        if(result.length == 0){
            throw new Error;
        }
        //Retrieve score for each course
        const perPage = 10;
        const currentPage = 1;
        const entryCount = result.rows.length; 
        // Map the result to create history entries
        const history = result.rows.map(row => {
            // Extract the year and term code from row.term
            const year = row.term ? row.term.toString().slice(0, 4) : ''; 
            const termCode = row.term ? row.term.toString().slice(-1) : ''; 
            // Determine the session based on the term code
            let sessionSuffix;
            let session;
            switch (termCode) {
                case '1':
                    sessionSuffix = '1';
                    session = year+'W';
                    break;
                case '2':
                    sessionSuffix = '2';
                    session = year+'W';
                    break;
                case '3':
                    sessionSuffix = '1';
                    session = year+'S';
                    break;
                case '4':
                    sessionSuffix = '2';
                    session = year+'S';
                    break;
                default:
                    sessionSuffix = '';
            }            
            // Return the formatted object
            return {
                instructorID: row.profileId || '',
                instructorName: row.full_name || '', 
                session: session ,
                term: sessionSuffix ,
                score: row.score ? Number(row.score.toFixed(2)) : "",
                term_num: row.term,
                ubcid:row.UBCId,
                location: row.location,
                enrollment: row.enrollment,
                meetingPattern: row.meetingPattern
            };
        });   

        //Calculate average score in single teaching performance
        query = `SELECT AVG("score") AS "avgScore" FROM "SingleTeachingPerformance"
                 WHERE "courseId" = $1 GROUP BY "courseId";`;
        result = await pool.query(query, [courseId]);
        const avgScore = result.rows.length > 0 ? Math.round(result.rows[0].avgScore) : 0; 
        
        
        //Get the TA info
        query = `SELECT TRIM("firstName" || ' ' || COALESCE("middleName" || ' ', '') || "lastName") AS full_name, 
                "email", "term", "UBCId"  FROM "TaAssignmentTable" WHERE "courseId" = $1 AND "term" <= $2`;  
        result = await pool.query(query,[courseId,latestTermResult]);
        const tainfo = result.rows.map(row => ({
            taname: row.full_name,
            taemail: row.email,
            taUBCId: row.UBCId,
            taterm: row.term
        }));                        
        const output = {
            currentPage,
            perPage,
            courseID: parseInt(courseId),
            entryCount,
            courseCode,
            latestTerm:latestTermResult,
            courseName: ctitle,
            courseDescription: description,
            division: dname,
            avgScore: avgScore, 
            history,
            tainfo
        };
        return output;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
    
};
module.exports = {
    getCourseHistory
}
