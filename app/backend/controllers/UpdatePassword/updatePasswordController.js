const updatePasswordService = require('../../services/UpdatePassword/updatePassword');

async function updatePassword(req, res)  {
  try {
   
    await updatePasswordService.updatePassword(req);

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
};

module.exports = {
    updatePassword
}