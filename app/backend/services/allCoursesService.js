const pool = require('../db/index.js');
const {updateAllCourses} = require('./updateAllCourses.js');
const {getLatestTerm} = require('./latestTerm.js');
async function getAllCourses() {
  try {
    const currentterm = await getLatestTerm();
    await updateAllCourses();
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
        currentTerm: currentterm,
        coursesCount: result.rowCount,
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
