const  pool = require('../db/index.js');
console.log(pool); 

exports.getCourseHistory = async (req, res) => {

    //const courseId = req.query.courseId;  
    const courseId = 1;
    console.log("Received courseId:", courseId);
    try {

        //Join profile, course, instructorassignment, single teaching performance tables
        let query = `SELECT
                  ita."term",  TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name,
                     c."ctitle", c."description", d."dcode" || ' ' || c."courseNum" AS "courseCode", stp."score", d."dname",p."profileId"
                    FROM
                        "Course" c
                    LEFT JOIN
                       "InstructorTeachingAssignment" ita ON c."courseId" = ita."courseId"
                    LEFT JOIN
                        "SingleTeachingPerformance" stp ON stp."courseId" = ita."courseId" AND stp."term" = ita."term"
                    LEFT JOIN
                        "Profile" p ON p."profileId" = ita."profileId"
                    LEFT JOIN "Division" d ON d."divisionId"= c."divisionId"
                    WHERE c."courseId"= $1
                    ORDER BY ita."term" DESC;`;
        let result = await pool.query(query,[courseId]);
        console.log("Executing query:", query);
        console.log("With parameters:", [courseId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Calculate average score in single teaching performance
        query = `SELECT AVG("score") AS "avgScore" FROM "SingleTeachingPerformance"
                 WHERE "courseId" = $1 GROUP BY "courseId";`;
        let result1 = await pool.query(query, [courseId]);
        console.log("Average score: ", result1);
        
        //Retrieve score in single teaching performance
        query = `SELECT "score" FROM "SingleTeachingPerformance"
        WHERE "courseId" = $1 ORDER BY "term" DESC;`;
        const result2 = await pool.query(query, [courseId]);
        console.log("Average score: ", result2);
 

        //Retrieve avgscore
        const avgScore = result1.rows.length > 0 ? Math.round(result1.rows[0].avgScore) : 0;

        //Retrieve score for each course
        const perPage = 10;
        const currentPage = 1;
        const entryCount = result.rows.length; // Number of entries found
        
        // Extract course details from the first result row
        const { ctitle, description, courseCode, dname } = result.rows[0];
        // Map the result to create history entries
        const history = result.rows.map(row => {
            // Extract the year and term code from row.term
            const year = row.term ? row.term.toString().slice(0, 4) : ''; // Gets the first four characters as the year
            const termCode = row.term ? row.term.toString().slice(-1) : ''; // Gets the last character as the term code
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

            // Prepare the session string combining the year with the appropriate suffix
            const term = sessionSuffix;
        
            // Return the formatted object
            return {
                instructorID: row.profileId || '', // Default to '' if NULL
                instructorName: row.full_name || '', // Default to '' if NULL
                session: session,
                term: term,
                score: row.score ? Number(row.score.toFixed(2)) : ""
            };
        });
                                                   
        console.log("History data: ", history);
                                                     
        const output = {
            currentPage,
            perPage,
            courseID: parseInt(courseId),
            entryCount,
            courseCode,
            courseName: ctitle,
            courseDescription: description,
            division: dname,
            avgScore: avgScore, 
            history
        };
        console.log("Output data: ", output);
        res.json(output);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
