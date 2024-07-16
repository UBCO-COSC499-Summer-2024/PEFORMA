const pool = require('../db/index.js');
const { getLatestTerm } = require('./latestTerm.js');

async function getCourseInformation() {
  try {
    const latestTerm = await getLatestTerm(); 
    const query = `
      SELECT 
        ita."courseId",
        COALESCE(STRING_AGG(DISTINCT d."dcode" || ' ' || c."courseNum", ', ') FILTER (WHERE c."courseNum" IS NOT NULL), '{}') AS courses,
        COALESCE(ARRAY_AGG(DISTINCT TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName")) FILTER (WHERE p."UBCId" IS NOT NULL), '{}') AS full_names,
        COALESCE(ARRAY_AGG(DISTINCT p."profileId")) AS profileIds
      FROM "InstructorTeachingAssignment" ita
      LEFT JOIN "Course" c ON c."courseId" = ita."courseId"
      LEFT JOIN "Profile" p ON p."profileId" = ita."profileId"
      LEFT JOIN "Division" d ON d."divisionId" = c."divisionId"
      WHERE ita."term" = $1
      GROUP BY ita."courseId";
    `;
    const result = await pool.query(query, [latestTerm]);

    const formattedData = result.rows.map(row => ({
      courseId: row.courseId,
      courseCode: row.courses,
      instructor: row.profileids.map((profileId, index) => ({
        profileId: profileId,
        name: row.full_names[index]
      }))
    }));
    console.log("HE&&&",formattedData);
    const courses = {
        courses:formattedData
    }
    return courses;
  } catch (error) {
    console.error('Error fetching course information:', error);
    throw error; 
  }
}
module.exports = {
    getCourseInformation
}
