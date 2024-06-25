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
                     c."ctitle", c."description", d."dcode" || ' ' || c."courseNum" AS "courseCode", stp."score"
                    FROM
                        "InstructorTeachingAssignment" ita
                    JOIN
                       "Course" c ON c."courseId" = ita."courseId"
                    JOIN
                        "SingleTeachingPerformance" stp ON stp."courseId" = ita."courseId" AND stp."term" = ita."term"
                    JOIN
                        "Profile" p ON p."profileId" = ita."profileId"
                    JOIN "Division" d ON d."divisionId"= c."divisionId"
                    WHERE c."courseId"= $1;`;
        let result = await pool.query(query,[courseId]);
        console.log("Executing query:", query);
        console.log("With parameters:", [courseId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        query = `SELECT AVG("score") AS "avgScore" FROM "SingleTeachingPerformance"
                 WHERE "courseId" = $1 GROUP BY "courseId";`;
        let result1 = await pool.query(query, [courseId]);
        console.log("Average score: ", result1);
        if (result1.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        query = `SELECT "score" FROM "SingleTeachingPerformance"
        WHERE "courseId" = $1;`;
        result2 = await pool.query(query, [courseId]);
        console.log("Average score: ", result2);
        if (result2.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }


        //Retrieve avgscore
        const avgScore = Math.round(result1.rows[0].avgScore);

        //Retrieve score for each course
        const perPage = 10;
        const currentPage = 1;
        const entryCount = result.rows.length; // Number of entries found
        
        // Extract course details from the first result row
        const { ctitle, description, courseCode, divisionName } = result.rows[0];
        // Map the result to create history entries
        const history = result.rows.map(row => ({
            instructorID: row.profileId,
            instructorName: row.full_name,
            session: `Session based on term ${row.term}`, 
            term: row.term,
            score: row.score
        }));                                             
        console.log("History data: ", history);
                                                     
        const output = {
            currentPage,
            perPage,
            courseID: parseInt(courseId),
            entryCount,
            courseCode,
            courseName: ctitle,
            courseDescription: description,
            division: divisionName,
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
