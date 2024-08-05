const pool = require('../../db/index'); 
const {getLatestTerm} = require('../latestTerm');
async function removeInstructorCourse (req)  {
const currentTerm = await getLatestTerm();

  const { profileId, courseId} = req.body;
  try {
    //Remove instructor from Instrutor Teaching Assignment table
    const result = await pool.query(
      'DELETE FROM "InstructorTeachingAssignment" WHERE "profileId" = $1 AND "courseId" = $2 AND "term" = $3 RETURNING *',
      [profileId, courseId, currentTerm]
    );

    if (result.rowCount === 0) {
      throw new Error('No matching entry found to delete');
    }
    return true;
  } catch (error) {
    console.error('Error removing instructor:', error);
    throw error;
  }
};
module.exports = {
    removeInstructorCourse
}
