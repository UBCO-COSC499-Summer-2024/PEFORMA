const  pool = require('../db/index.js');
console.log(pool); 

exports.getCourseHistory = async (req, res) => {

    const courseId = req.query.courseId;  
    console.log("Received courseId:", courseId);
    try {

        //Join profile, course, instructorassignment tables
        let query = `SELECT
                  ita."term",  TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name,
                     c."ctitle", c."description", d."dcode" || ' ' || c."courseNum" AS courseCode
                    FROM
                        "InstructorTeachingAssignment" ita
                    JOIN
                       "Course" c ON c."courseId" = ita."courseId"
                    JOIN
                        "Profile" p ON p."profileId" = ita."profileId"
                    JOIN "Division" d ON d."divisionId"= c."divisionId"
                    WHERE c."courseId"=$1;`;
        //let result = await pool.query(query, [id]);
        let result = await pool.query(query,[courseId]);
        console.log("Executing query:", query);
        console.log("With parameters:", [courseId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        //Extract course info

        //Extract course history

        //Get average score of the course
        
        const output=0;
        res.json(output);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
