
const express = require('express');
const router = express.Router();
const pool = require('../db/index');  // 导入数据库连接池
const authenticate = require("../Manager/authenticate")

router.get('/instructors', authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            `
             SELECT "profileId", "UBCId" AS "id",
                   "firstName" || ' ' || COALESCE("middleName" || ' ', '') || "lastName" AS "name"
            FROM "Profile"
            `
        );
        //console.log(JSON.stringify(result));
        res.json({
            instructors: result.rows,
            instructorCount: result.rowCount,
            perPage: 8,
            currentPage: 1
        });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
