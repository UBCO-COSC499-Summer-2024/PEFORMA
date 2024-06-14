const express = require('express');
const { pool, testDB } = require('./config/db.js'); 
const app = express();
const port = process.env.PORT || 3001;  // Default to 3001 if environment variable not set

app.use(express.json());

// Test database connection
testDB();

// Route to handle the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

// Example route to fetch all profiles from a 'Profile' table
app.get('/profile', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM public."Profile"');
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
// app.get('/profiles', async (req, res) => {
//     try {
//         const { rows } = await pool.query('SELECT NOW()');
//         res.json(rows);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error');
//     }
// });

// Retrieving Course data
app.get('/api/courses', async (req, res) => {
    try {

        const divisionCode = req.query.division;

        const divisionMap = {
            'COSC': 1,
            'MATH': 2,
            'PHYS': 3,
            'STAT': 4
          };

        const divisionId = divisionMap[divisionCode];

        const result = await pool.query(`
            SELECT c."courseNum" AS courseNumber, c."ctitle" AS courseTitle, p."firstName" AS firstName, p."lastName" AS lastName, p."UBCId" AS UBCId, p."email" AS email
            FROM public."Course" c
            JOIN public."InstructorTeachingAssignment" a ON c."courseId" = a."courseId"
            JOIN public."Profile" p ON p."profileId" = a."profileId"
            WHERE c."divisionId" = $1 
        `, [divisionId]);

        const divisionLabelMap = {
            1: 'Computer Science',
            2: 'Mathematics',
            3: 'Physics',
            4: 'Statistics'
          };

        const divisionLabel = divisionLabelMap[divisionId];

        // Reformat the data
        const formattedData = {
            division: divisionCode,
            divisionLabel: divisionLabel,
            courses: result.rows.map(row => ({
                id: `${divisionCode} ${row.courseNumber}`,
                title: row.courseTitle,
                instructor: `${row.firstName} ${row.lastName}`,
                ubcid: row.UBCId,
                email: row.email
            }))
        };

        res.json(formattedData);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});


// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
