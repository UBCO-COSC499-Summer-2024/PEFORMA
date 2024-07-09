const pool = require('../db/index.js');

exports.getAllInstructors = async (req, res) => {
    try {
        let query = `
            SELECT p."UBCId", 
                   TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name, 
                   d."dname" AS department,
                   ARRAY_AGG(sra."serviceRoleId") AS roleid,
                   ARRAY_AGG(sr."stitle") AS serviceRole,
                   p."email",
                   a."isActive"
            FROM "Profile" p
            LEFT JOIN "Division" d ON d."divisionId" = p."divisionId"
            LEFT JOIN "ServiceRoleAssignment" sra ON sra."profileId" = p."profileId"
            LEFT JOIN "ServiceRole" sr ON sr."serviceRoleId" = sra."serviceRoleId"
            LEFT JOIN "Account" a ON a."profileId" = p."profileId"
            GROUP BY p."UBCId", p."firstName", p."middleName", p."lastName", d."dname", p."email", a."isActive";
        `;
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No instructor data found.' });
        }


        const members = result.rows.map(row => ({
            ubcid: row.UBCId || '',
            name: row.full_name || '',
            department: row.department || '',
            roleid: row.roleid || '',
            serviceRole: row.servicerole || '',
            email: row.email || '',
            status: row.isActive || ''
        }));

        const output = {
            currentPage: 1,
            perPage: 10,
            membersCount: members.length,
            members: members
        };

        console.log("Formatted output:", output);
        return res.json(output);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
};
