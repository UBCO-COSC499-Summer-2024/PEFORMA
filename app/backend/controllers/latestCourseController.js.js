const pool = require('../db'); // Assuming you have a db.js file exporting your pg pool instance

exports.getLatestCourseTerm = async (req, res) => {
  const { courseId } = req.query;

  try {
    const result = await pool.query(
      `SELECT "term" FROM "CourseByTerm" WHERE "courseId" = $1 ORDER BY "term" DESC LIMIT 1`,
      [courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No terms found for this course' });
    }

    res.status(200).json({ latestTerm: result.rows[0].term });
  } catch (error) {
    console.error('Error fetching latest course term:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
