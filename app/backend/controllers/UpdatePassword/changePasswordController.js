const changePasswordService = require('../../services/UpdatePassword/changePasswordService');

exports.changePassword = async (req, res) => {
    try {
        const { profileId } = req.params;
        const { currentPassword, newPassword } = req.body;

        const result = await changePasswordService.changePassword(profileId, currentPassword, newPassword);

        if (result.success) {
            res.status(200).json({ message: 'Password changed successfully' });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in changePassword controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};