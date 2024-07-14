const pool = require('../db/index.js');

async function getTeachingAssignment() {
  try {
    let result = await pool.query('SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    const currTerm = result.rows[0].current_term;
    result = await pool.query(`
    SELECT 
    TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name,
    p."UBCId", 
    d."dname" AS department_name,
    COALESCE(ARRAY_AGG(DISTINCT c2."dcode" || ' ' || c."courseNum") FILTER (WHERE c."courseNum" IS NOT NULL), '{}') AS courses,
    COALESCE(ARRAY_AGG(DISTINCT c."ctitle") FILTER (WHERE c."ctitle" IS NOT NULL), '{}') AS courseName,
    COALESCE(ARRAY_AGG(DISTINCT c."courseId") FILTER (WHERE c."courseId" IS NOT NULL), '{}') AS courseId,
    p."email"
    FROM "Profile" p
    LEFT JOIN "Division" d ON d."divisionId" = p."divisionId"
    LEFT JOIN "InstructorTeachingAssignment" ita ON ita."profileId" = p."profileId"
    LEFT JOIN "Course" c ON c."courseId" = ita."courseId" 
    LEFT JOIN "Division" c2 ON c2."divisionId" = c."divisionId" 
    WHERE ita."term" = $1
    GROUP BY p."firstName", p."middleName", p."lastName", p."email", p."UBCId", d."dname"
    `, [currTerm]);
      console.log(result);
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
    return formattedData;

  } catch (error) {
    throw error; 
  }
}

module.exports = {
  getTeachingAssignment
};
