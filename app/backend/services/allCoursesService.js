const pool = require('../db/index.js');

async function getAllCourses() {
  try {

    const countResult = await pool.query(`
                                        SELECT COUNT(*) 
                                        FROM "Course"
                                        `,);
    const coursesCount = parseInt(countResult.rows[0].count);

    let result = await pool.query(`
      SELECT c."courseId",
             c."ctitle",
             c."description",
             d."dcode",
             c."courseNum",
             c."isActive"
      FROM public."Course" c
      JOIN public."Division" d ON c."divisionId" = d."divisionId"
      ORDER BY c."divisionId" ASC, c."courseNum" ASC;
    `); // Removed LIMIT and OFFSET

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
    console.log("The length of the result is ", result.rowCount);
    console.log("Formatted Data: ", formattedData);
    return formattedData;

  } catch (error) {
    throw error; 
  }
}

module.exports = {
  getAllCourses
};
