const pool = require('../../db/index.js');
const { getLatestTerm } = require('../latestTerm.js');

async function getTeachingAssignment() {
  try {
    const currTerm = await getLatestTerm();
    //Retrieve the instructor info including the courses they teach
    const result = await pool.query(`
      SELECT 
        p."profileId",
        COALESCE(TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName"), 'Not Assigned') AS full_name,
        COALESCE(p."UBCId", 'N/A') AS "UBCId", 
        COALESCE(d."dname", 'N/A') AS department_name,
        ARRAY_AGG(DISTINCT c."courseId") FILTER (WHERE c."courseId" IS NOT NULL) AS courseId,
        COALESCE(p."email", 'N/A') AS email
      FROM "Course" c
      LEFT JOIN "CourseByTerm" cbt ON cbt."courseId" = c."courseId"
      LEFT JOIN "Division" c2 ON c2."divisionId" = c."divisionId"
      LEFT JOIN "InstructorTeachingAssignment" ita ON ita."courseId" = c."courseId" AND ita."term" = cbt."term"
      LEFT JOIN "Profile" p ON p."profileId" = ita."profileId"
      LEFT JOIN "Division" d ON d."divisionId" = p."divisionId"
      WHERE cbt."term" = $1
      GROUP BY p."profileId", p."firstName", p."middleName", p."lastName", p."email", p."UBCId", d."dname"
    `, [currTerm]);
    // Get additional course information based on courseId
    for (let row of result.rows) {
      const courseDetails = await pool.query(`
        SELECT TRIM(d."dcode" || ' ' || c."courseNum") AS coursename, c."ctitle",c."courseId"
        FROM "Course" c
        JOIN "Division" d ON d."divisionId" = c."divisionId"
        WHERE c."courseId" = ANY($1)
      `, [row.courseid]);

      
    // Initialize arrays to hold course names and titles
    row.courseNames = [];
    row.courseTitles = [];
    row.courseId = [];
    // Populate the arrays with data from the courseDetails
    courseDetails.rows.forEach(cd => {
      row.courseNames.push(cd.coursename);
      row.courseTitles.push(cd.ctitle);
      row.courseId.push(cd.courseId);
    });


    }
    // Reformat the data
    const formattedData = {
      currentTerm: currTerm,
      currentPage: 1,
      divisionCoursesCount: result.rowCount,
      teachinginfo: result.rows.map(row => {
        return {
          instructor: row.full_name,
          ubcid: row.UBCId,
          division: row.department_name,
          courses: row.courseNames,  
          courseName: row.courseTitles,
          courseid: row.courseId,
          email: row.email
        };
      })
    };

    return formattedData;

  } catch (error) {
    console.error('Failed to fetch teaching assignments:', error);
    throw error;
  }
}

module.exports = {
  getTeachingAssignment
};
