const userProfileService = require('../services/userProfileService');

exports.getUserProfile = async (req, res) => {
  console.log("Controller reached. ProfileId:", req.params.profileId);
  const { profileId } = req.params;
  try {
    console.log("Calling userProfileService...");
    const userProfile = await userProfileService.getUserProfileById(profileId);
    console.log("Service response:", userProfile);
    if (userProfile) {
      res.json(userProfile);
    } else {
      console.log("Profile not found");
      res.status(404).json({ error: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile controller:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};