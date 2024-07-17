const userService = require('../services/userService');

exports.getUserById = async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await userService.getUserById(profileId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserById controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};