const userProfileGetService = require('../../services/ShowInfo/userProfileGetService');

exports.getUserProfile = async (req, res) => {
  const { profileId } = req.params;
  try {
    const userProfile = await userProfileGetService.getUserProfileById(profileId); //Execute service
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