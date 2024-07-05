const pool = require('../db/index.js');

exports.getRoleInfo = async (req, res) => {
    const serviceRoleId = req.query.serviceRoleId;
    console.log("Received service role ID:", serviceRoleId);

    try {
        let query = `SELECT "year" FROM "ServiceRoleAssignment" ORDER BY "year" DESC LIMIT 1;`;
        let result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service role not found' });
        }
        const year = result.rows[0].year;

        query = `
            SELECT sr."stitle", sr."description", d."dname", p."UBCId",
            TRIM(p."firstName" || ' ' || COALESCE(p."middleName" || ' ', '') || p."lastName") AS full_name
            FROM "ServiceRole" sr
            JOIN "Division" d ON d."divisionId" = sr."divisionId"
            LEFT JOIN "ServiceRoleAssignment" sra ON sra."serviceRoleId" = sr."serviceRoleId" AND sra."year" = $2
            LEFT JOIN "Profile" p ON p."profileId" = sra."profileId"
            WHERE sr."serviceRoleId" = $1
            ORDER BY sra."year" DESC;
        `;
        result = await pool.query(query, [serviceRoleId, year]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No users found for the specified role' });
        }

        const { stitle, description, dname } = result.rows[0];
        const assigneeCount = result.rows.length;
        const assignees = result.rows.map(row => ({
            instructorID: row.UBCId || '',
            name: row.full_name || ''
        }));

        query = `
            SELECT ("JANHour" + "FEBHour" + "MARHour" + "APRHour" + "MAYHour" +
            "JUNHour" + "JULHour" + "AUGHour" + "SEPHour" + "OCTHour" +
            "NOVHour" + "DECHour") AS total_hours
            FROM "ServiceRoleByYear"
            WHERE "serviceRoleId" = $1 AND "year" = $2;
        `;
        result = await pool.query(query, [serviceRoleId, year]);
        const benchmark = Number((result.rows[0].total_hours / 12).toFixed(2));

        const output = {
            currentPage: 1,
            perPage: 5,
            roleID: serviceRoleId,
            assigneeCount: assigneeCount,
            roleName: stitle || "",
            roleDescription: description || "",
            department: dname || "",
            benchmark: benchmark,
            assignees: assignees
        };

        console.log("Output:", output);
        res.json(output);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error during fetching profile' });
    }
};
