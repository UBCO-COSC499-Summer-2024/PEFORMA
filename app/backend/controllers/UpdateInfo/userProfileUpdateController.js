const userProfileUpdateService = require('../../services/UpdateInfo/userProfileUpdateService');

exports.updateUserProfile = async (req, res) => {
  const { profileId } = req.params;
  const updatedData = req.body;
  try {
    // Ensure the user can only update their own profile

    // If a file was uploaded, add it to updatedData
    if (req.file) {
      updatedData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedProfile = await userProfileUpdateService.updateUserProfile(profileId, updatedData); //Execute service
    if (updatedProfile) {
      res.json(updatedProfile);
    } else {
      res.status(404).json({ error: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error in updateUserProfile controller:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};