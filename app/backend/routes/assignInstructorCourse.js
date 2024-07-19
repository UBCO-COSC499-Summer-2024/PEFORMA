const express = require('express');
const router = express.Router();
const pool = require('../db/index'); // Adjust the path to your db connection module

// Route to assign an instructor to a course
router.post('/assignInstructorCourse', async (req, res) => {
  const { profileId, courseId, term } = req.body;

  if (!profileId || !courseId || !term) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the course and term exist in CourseByTerm
    const checkCourseTermQuery = `
      SELECT * FROM "CourseByTerm" WHERE "courseId" = $1 AND "term" = $2;
    `;
    const checkResult = await pool.query(checkCourseTermQuery, [courseId, term]);

    console.log('result for searching course by term:\n',checkResult);

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ error: 'Create course for this term first' });
    }

    // Insert the instructor assignment
    const insertQuery = `
      INSERT INTO "InstructorTeachingAssignment" ("profileId", "courseId", "term")
      VALUES ($1, $2, $3)
      ON CONFLICT ("profileId", "courseId", "term") DO NOTHING
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [profileId, courseId, term]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Assignment already exists or could not be created' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error assigning instructor to course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
