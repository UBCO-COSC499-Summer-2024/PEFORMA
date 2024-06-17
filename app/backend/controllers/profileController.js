const { pool } = require('../db/index.js'); // Adjust the path as necessary for your db connection
console.log(pool); // See what pool actually is

exports.getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        let query = `SELECT * FROM "Profile" WHERE "profileId" = $1;`;
        let result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Extract profile information
        const row = result.rows[0];
        const firstName = row.firstName;
        const middleName = row.middleName || '';  // Use an empty string if middleName is null
        const lastName = row.lastName;
        const name = `${firstName} ${middleName} ${lastName}`.trim();  // Construct full name and trim any extra spaces
        const benchmark = row.sRoleBenchmark;
        const ubcId = row.UBCId;
        const email = row.email;
        const phoneNum = row.phoneNum;
        const office = `${row.officeBuilding} ${row.officeNum}`;  // Construct office info
        query = `
            SELECT sr.stitle
            FROM "ServiceRoleAssignment" "sra"
            JOIN "ServiceRole" "sr" ON "sra"."serviceRoleId" = "sr"."serviceRoleId"
            WHERE "sra"."profileId" = $1;
        `; 
        result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        //const serviceRoles = result.rows;
        const roles = result.rows.map(row => row.stitle);

        query = `
            SELECT c.ctitle
            FROM "InstructorTeachingAssignment" "ita"
            JOIN "Course" "c" ON "ita"."courseId" = "c"."courseId"
            WHERE "ita"."profileId" = $1;
        `; 
        result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course assignments not found' });
        }
        //const courses = result.rows;
        const teachingRoles = result.rows.map(row => ({ assign: row.ctitle }));  // Mapping ctitle to roles
        // Build the profile data object
        const profileData = {
            name: name,
            ubcid: ubcId,
            benchmark:benchmark,
            roles:roles,
            email: email,
            phoneNum: phoneNum,
            office: office,
            teachingAssignments:teachingRoles
        };    
        // Send response
        res.json(profileData);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
