const  pool = require('../db/index.js'); 
const { getAllInstructors } = require('../controllers/allInstructorsController'); 
console.log(pool); 

exports.getStatusChangeMembers = async (req, res) => {
    const ubcId = req.body.memberId 
    const status = req.body.newStatus;
    console.log("Service Role ID: ",serviceRoleId);
    console.log("Status: ", status);
    try{
        let query = `SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1;`;
        let result = await pool.query(query,[ubcId]);
        if(result.rows.length == 0){
            return res.status(404).json({message: 'No profile data found'});
        }
        const profileId = result.rows[0].profileId;
        query = `UPDATE "Account" SET "isActive" = $1 WHERE "profileId" = $2 RETURNING *;`;

        result = await pool.query(query, [status, profileId]);
        if (result.rows.length === 0) {
            console.log("No accounts found");
        return res.status(404).json({ message: 'No serviceRole data found.' });
        } else {
            console.log("Update status account complete");
            const rolesData = await getAllInstructors(); // Call the function correctly
            res.json(rolesData);  // Send the fetched roles data as response
        }

    }
    catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }


};