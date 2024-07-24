const pool = require('../db/index.js');
const {getLatestTerm} = require('./latestTerm.js');
const divisionMap = {
    'ALL': 0,
    'COSC': 1, 
    'MATH': 2,
    'PHYS': 3,
    'STAT': 4
};

const divisionLabelMap = {
    0: 'All',
    1: 'Computer Science',
    2: 'Mathematics',
    3: 'Physics',
    4: 'Statistics'
};

async function getFormattedCourseData(divisionCode) {
    
    const divisionId = divisionMap[divisionCode];
    const divisionLabel = divisionLabelMap[divisionId];
    const latestTerm = await getLatestTerm();
    let query = `SELECT d."dcode" || ' ' || c."courseNum" AS "courseCode", c."courseId", c."ctitle", 
                array_agg(
                    CASE 
                        WHEN p."firstName" IS NULL THEN 'Not Assigned'
                        ELSE TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName")
                    END
                ) AS instructor_names,
                array_agg(COALESCE(p."UBCId", 'No ubcids')) AS ubc_ids,
                array_agg(COALESCE(p."email", 'No email')) AS email,
                array_agg(COALESCE(p."profileId", '0')) AS profileid

                FROM 
                    "Course" c
                    LEFT JOIN "CourseByTerm" cbt ON cbt."courseId" = c."courseId"
                    LEFT JOIN "InstructorTeachingAssignment" ita ON ita."courseId" = cbt."courseId" AND ita."term" = 20244
                    LEFT JOIN "Profile" p ON p."profileId" = ita."profileId"
                    LEFT JOIN "Division" d ON d."divisionId" = c."divisionId"
                WHERE 
                    cbt."term" = $1 AND ($2 = 0 OR d."divisionId" = $2)
                GROUP BY 
                    c."courseId", d."dcode", c."courseNum", c."ctitle"
                ORDER BY 
                    c."courseId"`;
    const result = await pool.query(query,[latestTerm,divisionId]);
    const courses = result.rows.map(row =>{
        return{
            id: row.courseCode,
            courseId: row.courseId,
            title: row.ctitle,
            instructor: row.instructor_names,
            ubcid: row.ubc_ids,
            email: row.email,
            profileid: row.profileid
        }
    });

    const formattedData = {
        division: divisionCode,
        divisionLabel: divisionLabel,
        currentPage: 1,
        perPage: 10,
        divisionCoursesCount: result.rows.length,
        courses: courses
    }
   

    console.log(formattedData);

    return formattedData;
}

module.exports = {
    getFormattedCourseData
};