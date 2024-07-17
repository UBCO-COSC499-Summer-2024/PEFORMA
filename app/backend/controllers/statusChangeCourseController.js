const  pool = require('../db/index.js'); 
const { getAllCourses } = require('../services/allCoursesService.js');  
console.log(pool); 

exports.getStatusChangeCourse = async (req, res) => {
    const courseId = req.body.courseid; 
    const status = req.body.newStatus;
    console.log("Course ID: ",courseId);
    console.log("Status: ", status);
    try{
        let query = `UPDATE "Course" SET "isActive" = $1 WHERE "courseId" = $2 RETURNING *;`;
        let result = await pool.query(query, [status, courseId]);
        if (result.rows.length === 0) {
            console.log("No course data found");
        return res.status(404).json({ message: 'No course found.' });
        } else {
            console.log("Update status course complete");
            const courseData = await getAllCourses();
            res.json(courseData);
        }

    }
    catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    

};