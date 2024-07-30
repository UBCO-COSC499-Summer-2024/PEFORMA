const updateRoleInfoService = require('../../services/UpdateInfo/updateRoleInfo');

async function updateRoleInfo (req, res)  {
    try {
        await updateRoleInfoService.updateRoleInfo(req);
        res.status(200).send('Role information updated successfully');
    } catch (error) {
        console.error('Error executing query:', error.stack);
        res.status(500).send('Error updating role information');
    }
    };

module.exports = {
    updateRoleInfo
}