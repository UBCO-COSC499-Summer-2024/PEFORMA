const removeInstructorRoleService = require('../services/removeInstructorRole');
async function removeInstructorRole (req, res)  {
  
  try {
    await removeInstructorRoleService.removeInstructorRole(req);
    res.status(200).json({ message: 'Instructor removed from service role assignment'});
  } catch (error) {
    console.error('Error removing instructor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  removeInstructorRole
}

