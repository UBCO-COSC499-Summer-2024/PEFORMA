const express = require('express');
const pool = require('../db/index'); 

async function instructorFetch(){
    try {
        const result = await pool.query(
            `
             SELECT "profileId", "UBCId" AS "id",
                   "firstName" || ' ' || COALESCE("middleName" || ' ', '') || "lastName" AS "name"
            FROM "Profile"
            `
        );
        const output = {
            instructors: result.rows,
            instructorCount: result.rowCount,
            perPage: 8,
            currentPage: 1

        };
            
        return output;
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    instructorFetch
}

