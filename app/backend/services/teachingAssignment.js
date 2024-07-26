const pool = require('../db/index.js');
const {getLatestTerm} = require('./latestTerm.js');
async function getTeachingAssignment() {
  try {
    const currTerm = await getLatestTerm();
    result = await pool.query(`
   SELECT 
    COALESCE(TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName"), 'Not Assigned') AS full_name,
    COALESCE(p."UBCId", 'N/A') AS "UBCId", 
    COALESCE(d."dname", 'N/A') AS department_name,
    COALESCE(ARRAY_AGG(DISTINCT c2."dcode" || ' ' || c."courseNum") FILTER (WHERE c."courseNum" IS NOT NULL), '{}') AS courses,
    COALESCE(ARRAY_AGG(DISTINCT c."ctitle") FILTER (WHERE c."ctitle" IS NOT NULL), '{}') AS courseName,
    COALESCE(ARRAY_AGG(DISTINCT c."courseId") FILTER (WHERE c."courseId" IS NOT NULL), '{}') AS courseId,
    COALESCE(p."email", 'N/A') AS email
    FROM "CourseByTerm" cbt
    LEFT JOIN "Course" c ON c."courseId" = cbt."courseId"
    LEFT JOIN "Division" c2 ON c2."divisionId" = c."divisionId"
    LEFT JOIN "InstructorTeachingAssignment" ita ON ita."courseId" = cbt."courseId" AND ita."term" = cbt."term"
    LEFT JOIN "Profile" p ON p."profileId" = ita."profileId"
    LEFT JOIN "Division" d ON d."divisionId" = p."divisionId"
    WHERE cbt."term" = $1
    GROUP BY p."firstName", p."middleName", p."lastName", p."email", p."UBCId", d."dname"
    `, [currTerm]);
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
                courses: row.courses,
                courseName:row.coursename,
                courseid:row.courseid,
                email: row.email
            };
        })
    }
    console.log(formattedData);
    return formattedData;

  } catch (error) {
    throw error; 
  }
}

module.exports = {
  getTeachingAssignment
};
