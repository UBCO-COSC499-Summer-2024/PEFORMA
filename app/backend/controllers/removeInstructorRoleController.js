
const pool = require('../db'); // Assuming you have a db.js file exporting your pg pool instance

exports.removeInstructorRole = async (req, res) => {
  const { serviceRoleId, id } = req.body;
  const currentYear = new Date().getFullYear();
  
  try {
    const profileResult = await pool.query('SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1', [String(id)]);
    if (profileResult.rowCount === 0) {
      return res.status(404).json({ message: `Instructor not found for ${id}` });
    }
    const profileId = profileResult.rows[0].profileId;

    // Delete the service role assignment for the given profileId, serviceRoleId, and year
    const deleteResult = await pool.query(
        'DELETE FROM "ServiceRoleAssignment" WHERE "profileId" = $1 AND "serviceRoleId" = $2 AND "year" = $3 RETURNING *',
        [profileId, serviceRoleId, currentYear]
      );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'No assignment found for this year' });
    }

    res.status(200).json({ message: 'Instructor removed from service role assignment', result: deleteResult.rows[0] });
  } catch (error) {
    console.error('Error removing instructor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

