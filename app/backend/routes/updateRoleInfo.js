const express = require('express');
const router = express.Router();
const pool = require('../db/index.js');


router.post('/updateRoleInfo', async (req, res) => {
    const newServiceRole = req.body;
    console.log('Message from updateRoleInfo router:');
    console.log('Received new assignee data:', JSON.stringify(newServiceRole));
    console.log('Message ends.\n\n');
    var divisionid=0;
    //const description = newServiceRole.roleDescription.replace(/\n/g, ' ');
    switch(newServiceRole.department){
        case "Computer Science": divisionid=1;break;
        case "Mathematics": divisionid=2;break;
        case "Physics": divisionid=3;break;
        case "Statistics": divisionid=4;break;
        default: divisionid=0;
    }

    const data = [
        newServiceRole.roleName, 
        newServiceRole.roleDescription,
        newServiceRole.isActive,
        divisionid,
        newServiceRole.roleID
    ];

    console.log("roleName:\t",data[0],"\nroleDescription:\t",data[1],"\nisActive:",data[2],"roleId:\n",data[4],"divisionId:",data[3]);
    // Handle the data (e.g., save to database)
    const query = `
    UPDATE "ServiceRole"
    SET "stitle" = $1,
    "description" = $2,
    "isActive" = $3,
    "divisionId" = $4
    WHERE "serviceRoleId" = $5
    `;
    try {
        const result = await pool.query(query, data);
        console.log(result);
        console.log("Query executed successfully.");
        res.status(200).send('Role information updated successfully');
    } catch (error) {
        console.error('Error executing query:', error.stack);
        res.status(500).send('Error updating role information');
    }
    });

module.exports = router;