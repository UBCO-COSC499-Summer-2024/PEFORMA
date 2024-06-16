const express = require('express');
const cors = require('cors');
const { pool, testDB } = require('./config/db.js'); 
const app = express();
const port = process.env.PORT || 3001;  // Default to 3001 if environment variable not set

app.use(express.json());
app.use(cors());

// Test database connection
testDB();

// Route to handle the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

// // Example route to fetch all profiles from a 'Profile' table
// app.get('/profile', async (req, res) => {
//     try {
//         const { rows } = await pool.query('SELECT * FROM public."Profile"');
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
            SELECT 
                (SELECT COUNT(*) 
                 FROM public."Course" c2
                 JOIN public."InstructorTeachingAssignment" a2 ON c2."courseId" = a2."courseId"
                 JOIN public."Profile" p2 ON p2."profileId" = a2."profileId"
                 WHERE c2."divisionId" = $1) AS division_courses_count,
                c."courseNum" AS course_number, c."ctitle" AS course_title, p."firstName" AS first_name, p."lastName" AS last_name, p."UBCId" AS ubc_id, p."email" AS email
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
            currPage:1, 
            perPage: 10,
            divisionCoursesCount: result.rows.length > 0 ? result.rows[0].division_courses_count : 0, // Default to 0 if no rows
            courses: result.rows.map(row => ({  
                id: `${divisionCode} ${row.course_number}`,
                title: row.course_title || null, // Set to null if falsy
                instructor: row.first_name || row.last_name ? `${row.first_name} ${row.last_name}` : null, 
                ubcid: row.ubc_id || null,
                email: row.email || null,
            })) 
        };

        console.log(formattedData);

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