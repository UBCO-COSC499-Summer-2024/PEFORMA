
const pool = require('../db'); 
async function removeInstructorRole(req)  {
  const { serviceRoleId, id } = req.body;
  const currentYear = new Date().getFullYear();
  
  try {
    const profileResult = await pool.query('SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1', [String(id)]);
    if (profileResult.rowCount === 0) {
      throw new Error( `Instructor not found for ${id}` );
    }
    const profileId = profileResult.rows[0].profileId;

    // Delete the service role assignment for the given profileId, serviceRoleId, and year
    const deleteResult = await pool.query(
        'DELETE FROM "ServiceRoleAssignment" WHERE "profileId" = $1 AND "serviceRoleId" = $2 AND "year" = $3 RETURNING *',
        [profileId, serviceRoleId, currentYear]
      );

    if (deleteResult.rowCount === 0) {
      throw new Error('No assignment found for this year');
    }

   return true;
  } catch (error) {
    console.error('Error removing instructor:', error);
    throw error;
  }
};
module.exports = {
    removeInstructorRole
}

