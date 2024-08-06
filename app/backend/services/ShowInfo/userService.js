const pool = require('../../db/index.js');

exports.getUserById = async (profileId) => {
  try {
    const query = 'SELECT "firstName", "lastName" FROM "Profile" WHERE "profileId" = $1';
    const result = await pool.query(query, [profileId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in getUserById service:', error);
    throw error;
  }
};