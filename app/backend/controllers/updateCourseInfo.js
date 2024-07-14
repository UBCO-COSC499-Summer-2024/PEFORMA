const express = require('express');
const router = express.Router();
const pool = require('../db/index.js');

router.post('/updateCourseInfo', async (req, res) => {
    const { courseId, courseDescription } = req.body;
    try {
        const query = 'UPDATE "Course" SET "description" = $1 WHERE "courseId" = $2';
        await pool.query(query, [courseDescription, courseId]);
        res.status(200).send('Course information updated successfully');
    } catch (error) {
        console.error('Error updating course information:', error.stack);
        res.status(500).send('Error updating course information');
    }
});

module.exports = router;
