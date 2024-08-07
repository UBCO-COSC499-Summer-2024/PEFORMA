const pool = require('../../db/index');

/**
 * Fetches recent meetings (within the last 3 days) along with their attendees.
 * @returns {Promise<Array>} An array of meeting objects with attendee information.
 */
async function getMeetings() {
    // SQL query to fetch meetings and their attendees
    const query = `
      SELECT 
        ml."meetingId" as id,
        ml."meetingTitle",
        ml."location",
        ml."date",
        ml."time",
        -- Subquery to get attendees who were present (attendance = true)
        COALESCE(
          (SELECT json_agg(json_build_object('ubcid', p."UBCId", 'name', concat(p."firstName", ' ', p."lastName")))
          FROM "MeetingAttendance" ma
          JOIN "Profile" p ON ma."UBCId" = p."UBCId"
          WHERE ma."meetingId" = ml."meetingId"),
          '[]'
        ) as participants
          FROM 
                  "MeetingLog" ml
          WHERE 
                  -- Filter for meetings within the last 3 days
                  ml."date"::date >= CURRENT_DATE - INTERVAL '3 days'
          GROUP BY 
                  ml."meetingId", ml."meetingTitle", ml."location", ml."date", ml."time"
          -- Order by most recent meetings first
          ORDER BY 
              ml."date"::date DESC, ml."time" DESC;

    `;

    try {
        // Execute the query
        const result = await pool.query(query);
        
        // Format the date and time in the results
        return result.rows.map(row => ({
            ...row,
            date: row.date, // Format date as YYYY-MM-DD
            time: row.time.slice(0, 5) // Format time as HH:MM
        }));
    } catch (error) {
        console.error('Error fetching meetings:', error);
        throw error;
    }
}

module.exports = { 
    getMeetings 
};