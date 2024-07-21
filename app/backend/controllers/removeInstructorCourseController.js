const pool = require('../db'); // Assuming you have a db.js file exporting your pg pool instance

exports.removeInstructorCourse = async (req, res) => {
  const { profileId, courseId, term } = req.body;

  try {
    const result = await pool.query(
      'DELETE FROM "InstructorTeachingAssignment" WHERE "profileId" = $1 AND "courseId" = $2 AND "term" = $3 RETURNING *',
      [Number(profileId), Number(courseId), Number(term)]
    );
    console.log(`Delete finish for ${profileId}, ${courseId}, ${term}`);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No matching entry found to delete' });
    }

    res.status(200).json({ message: 'Instructor removed from course assignment', result: result.rows[0] });
  } catch (error) {
    console.error('Error removing instructor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
