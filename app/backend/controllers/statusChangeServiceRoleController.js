const  pool = require('../db/index.js'); 
const { getAllServiceRoles } = require('../services/serviceRoleService');  // Corrected import to directly destructure the function
console.log(pool); 

exports.getStatusChangeServiceRole = async (req, res) => {
    const serviceRoleId = req.body.roleId; 
    const status = req.body.newStatus;
    console.log("Service Role ID: ",serviceRoleId);
    console.log("Status: ", status);
    try{
        let query = `UPDATE "ServiceRole" SET "isActive" = $1 WHERE "serviceRoleId" = $2 RETURNING *;`;
        let result = await pool.query(query, [status, serviceRoleId]);
        if (result.rows.length === 0) {
            console.log("No service role data found");
        return res.status(404).json({ message: 'No serviceRole data found.' });
        } else {
            console.log("Update status service role complete");
            const rolesData = await getAllServiceRoles(); // Call the function correctly
            res.json(rolesData);  // Send the fetched roles data as response
        }

    }
    catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    

};