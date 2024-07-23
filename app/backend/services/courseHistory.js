const  pool = require('../db/index.js');
const { getLatestTerm } = require('./latestTerm.js');
console.log(pool); 

async function getCourseHistory(req) {
    const latestTermResult = await getLatestTerm();
    const courseId = req.query.courseId;  
    console.log("Received courseId:", courseId);
    try {

        //Join profile, course, instructorassignment, single teaching performance tables
        let query = `SELECT DISTINCT ON (ita."term", full_name, c."ctitle", "courseCode", d."dname", p."profileId", p."UBCId")
        ita."term",
        TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name,
        c."ctitle",
        c."description",
        d."dcode" || ' ' || c."courseNum" AS "courseCode",
        stp."score",
        d."dname",
        p."profileId",
        p."UBCId"
        FROM
        "Course" c
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
        ita."term", full_name, c."ctitle", "courseCode", d."dname", p."profileId", p."UBCId", stp."score" DESC;
        `;
        let result = await pool.query(query,[courseId,latestTermResult]);

        //Retrieve score for each course
        const perPage = 10;
        const currentPage = 1;
        const entryCount = result.rows.length; 
        
        // Extract course details from the first result row
        const { ctitle, description, courseCode, dname } = result.rows[0];
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
                session: session,
                term: sessionSuffix,
                score: row.score ? Number(row.score.toFixed(2)) : "",
                term_num: row.term,
                ubcid:row.UBCId
            };
        });   

        //Calculate average score in single teaching performance
        query = `SELECT AVG("score") AS "avgScore" FROM "SingleTeachingPerformance"
                 WHERE "courseId" = $1 GROUP BY "courseId";`;
        result = await pool.query(query, [courseId]);
        const avgScore = result.rows.length > 0 ? Math.round(result.rows[0].avgScore) : 0;        
                                          
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
            history
        };
        return output;
    } catch (error) {
        console.error('Database query error:', error);
    }
    
};
module.exports = {
    getCourseHistory
}
