const  pool = require('../db/index.js'); 
console.log(pool);

exports.getCoursePerformance = async (req, res) => {
    const divisionId = parseInt(req.query.divisionId);
    //console.log("UBC ID is: ",ubcId); 
    console.log("Division is: ", divisionId);
    try {
        //Join Course, singleteaching performance and division tables
        //Get the latest term
        let query = `SELECT "term" FROM "SingleTeachingPerformance" ORDER BY "term" DESC LIMIT 1;`;
        let result = await pool.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Term not found' });
        }
        const term = result.rows[0].term;
        console.log("Latest term: ",term);
        query = `SELECT d."dcode"  || ' ' || c."courseNum" AS "DivisionAndCourse",
        stp."score"
        FROM "SingleTeachingPerformance" stp
        JOIN "Course" c ON c."courseId" = stp."courseId"
        JOIN "Division" d ON d."divisionId" = c."divisionId"
        WHERE c."divisionId" = $1 AND stp."term" = $2
        ORDER BY stp."score" DESC;
        `;
        result = await pool.query(query,[divisionId,term]);
        const data = result.rows.map(row => ({
            courseCode: row.DivisionAndCourse || '',
            rank:calculateRank(row.score) || '',
            score: row.score.toFixed(2) || ''
        }));
        const output = {
            courses:data
        };
        res.json(output);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    function calculateRank(score) {
        if (score >= 90) {
            return 'A';
        } else if (score >= 80) {
            return 'B';
        } else if (score >= 70) {
            return 'C';
        } else if (score >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }
};
