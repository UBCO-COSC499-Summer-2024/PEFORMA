const pool = require('../config/db.js');

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
    let result = await pool.query('SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    const currTerm = result.rows[0].current_term;

    result = await pool.query(`
        SELECT 
            (SELECT COUNT(*) 
            FROM public."Course" c2
            WHERE c2."divisionId" = $1) AS division_courses_count,
            c."courseNum" AS course_number, c."ctitle" AS course_title,
            ARRAY_AGG(p."firstName" || ' ' || p."lastName") AS instructor,
            ARRAY_AGG(p."UBCId") AS ubcid,
            ARRAY_AGG(p."email") AS email
        FROM public."Course" c
        JOIN public."InstructorTeachingAssignment" a ON c."courseId" = a."courseId"
        JOIN public."Profile" p ON p."profileId" = a."profileId"
        WHERE c."divisionId" = $1 AND a."term" = $2
        GROUP BY c."courseNum", c."ctitle"
        ORDER BY c."courseNum" ASC;
    `, [divisionId, currTerm]);

    // Reformat the data
    const formattedData = {
        division: divisionCode,
        divisionLabel: divisionLabel,
        currPage: 1,
        perPage: 10,
        divisionCoursesCount: result.rows.length > 0 ? result.rows[0].division_courses_count : 0,
        courses: result.rows.map(row => ({  
            id: `${divisionCode} ${row.course_number}`,
            title: row.course_title,
            instructor: row.instructor,
            ubcid: row.ubcid,
            email: row.email
        })) 
    };

    // console.log(formattedData);

    return formattedData;
}

module.exports = {
    getFormattedCourseData
};
