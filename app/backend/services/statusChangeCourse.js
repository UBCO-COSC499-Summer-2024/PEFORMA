const  pool = require('../db/index.js'); 
const { getAllCourses } = require('./allCoursesService.js');  
console.log(pool); 

async function getStatusChangeCourse(req) {
    const courseId = req.body.courseid; 
    const status = req.body.newStatus;
    try{
        let query = `UPDATE "Course" SET "isActive" = $1 WHERE "courseId" = $2 RETURNING *;`;
        let result = await pool.query(query, [status, courseId]);
        if (result.rows.length === 0) {
            console.log("No course data found");
            throw new Error('No course data found');
        } else {
            console.log("Update status course complete");
            const courseData = await getAllCourses();
            return courseData;
        }

    }
    catch (error) {
        throw error;
    }
    

};
module.exports = {
    getStatusChangeCourse
}