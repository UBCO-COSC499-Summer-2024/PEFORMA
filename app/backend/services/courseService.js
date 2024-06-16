const { pool } = require('../config/db.js');

const divisionMap = {
    'COSC': 1, 
    'MATH': 2,
    'PHYS': 3,
    'STAT': 4
};

const divisionLabelMap = {
    1: 'Computer Science',
    2: 'Mathematics',
    3: 'Physics',
    4: 'Statistics'
};

async function getFormattedCourseData(divisionCode) {
    
    const divisionId = divisionMap[divisionCode];
    const divisionLabel = divisionLabelMap[divisionId];
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

    // Reformat the data
    const formattedData = {
        division: divisionCode,
        divisionLabel: divisionLabel,
        currPage: 1, 
        perPage: 10,
        divisionCoursesCount: result.rows.length > 0 ? result.rows[0].division_courses_count : 0, 
        courses: result.rows.map(row => ({  
            id: `${divisionCode} ${row.course_number}`,
            title: row.course_title || null, 
            instructor: row.first_name || row.last_name ? `${row.first_name} ${row.last_name}` : null, 
            ubcid: row.ubc_id || null,
            email: row.email || null,
        })) 
    };

    // console.log(formattedData);

    return formattedData;
}

module.exports = {
    getFormattedCourseData
};
