const pool = require('../db/index.js');

async function getAllCourses() {
  try {
    let result = await pool.query('SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    const currTerm = result.rows[0].current_term;

    const countResult = await pool.query(`
                                        SELECT COUNT(*) 
                                        FROM public."CourseByTerm"
                                        `,);
    const coursesCount = parseInt(countResult.rows[0].count);

    result = await pool.query(`
      SELECT c."courseId",
             c."ctitle",
             c."description",
             d."dcode",
             c."courseNum",
             c."isActive"
      FROM public."Course" c
      JOIN public."CourseByTerm" cbt ON c."courseId" = cbt."courseId"
      JOIN public."Division" d ON c."divisionId" = d."divisionId"
      WHERE cbt."term" = $1
      ORDER BY c."divisionId" ASC, c."courseNum" ASC;
    `, [currTerm]); // Removed LIMIT and OFFSET

    // Reformat the data
    const formattedData = {
        currentPage: 1,
        perPage: 10,
        coursesCount: coursesCount,
        courses: result.rows.map(row => {
            return {
                id: row.courseId,
                courseCode: `${row.dcode} ${row.courseNum}`,
                title: row.ctitle,
                description: row.description,
                status:row.isActive
            };
        })
    }
    return formattedData;

  } catch (error) {
    throw error; 
  }
}

module.exports = {
  getAllCourses
};
