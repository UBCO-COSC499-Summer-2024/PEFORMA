const bcrypt = require('bcryptjs');
const pool = require('../../db/index.js');

exports.changePassword = async (profileId, currentPassword, newPassword) => {
    try {
        // Get the user's current password hash from the database
        const user = await pool.query('SELECT password FROM "Account" WHERE "profileId" = $1', [profileId]);

        if (user.rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const currentPasswordHash = user.rows[0].password;

        // Check if the current password is correct
        const isPasswordCorrect = (await bcrypt.compare(currentPassword, currentPasswordHash)) || (currentPassword === currentPasswordHash); 

        if (!isPasswordCorrect) {
            return { success: false, message: 'Current password is incorrect' };
        }

        // Hash the new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
        // const newPasswordHash = newPassword; // to be deleted

        // Update the password in the database
        await pool.query('UPDATE "Account" SET password = $1 WHERE "profileId" = $2', [newPasswordHash, profileId]);

        return { success: true };
    } catch (error) {
        console.error('Error in changePassword service:', error);
        throw error;
    }
};