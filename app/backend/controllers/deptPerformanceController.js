const  pool = require('../db/index.js'); // Adjust the path as necessary for your db connection
console.log(pool); // See what pool actually is

exports.getDepartPerformance = async (req, res) => {
    try {
        let query;
        let result;

        // First, get the latest term using your existing approach.
        query = `SELECT "term" FROM "SingleTeachingPerformance" ORDER BY "term" DESC LIMIT 1;`;
        result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No performance data found.' });
        }

        const latestTerm = result.rows[0].term;

        console.log("Latest term: ", latestTerm);

        // Now, fetch the average score by each divisionId for the latest term.
        query = `
            SELECT 
                c.divisionId, 
                AVG(stp.score) AS average_score
            FROM 
                "SingleTeachingPerformance" stp
            JOIN 
                "CourseByTerm" cbt ON stp.courseId = cbt.courseId AND stp.term = cbt.term
            JOIN 
                "Course" c ON cbt.courseId = c.courseId
            WHERE 
                stp.term = $1
            GROUP BY 
                c.divisionId
            ORDER BY 
                c.divisionId;
        `;

        result = await pool.query(query, [latestTerm]);

        console.log("Executing query:", query);
        console.log("With parameters:", [latestTerm]);
        // Map divisionId to the corresponding department names
        const labels = ["Computer Science", "Mathematics", "Physics", "Statistics"];  // Custom labels as per divisionId sequence
        const series = new Array(4).fill(0);  // Initialize an array to hold scores, pre-filled with 0 for all divisions

        // Populate the series array based on divisionId from the result
        result.rows.forEach(row => {
            const index = row.divisionId - 1;  // Assumes divisionId is 1-indexed and matches the order in `labels`
            series[index] = parseFloat(row.average_score.toFixed(2));  // Store average score, rounded to two decimal places
        });

        // Construct the final JSON object
        const output = {
            series: series,
            labels: labels
        };

        // Send the JSON response
        return res.json(output);


        
       

    
      
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
