const setCurrentTermService = require('../services/setCurrentTerm.js');
async function setCurrentTerm(req, res){
    try {
       
        await setCurrentTermService.setCurrentTerm(req);
        res.status(200).json({ message: 'Current term updated successfully' });
    } catch (error) {
        console.error('Error updating current term:', error);
        res.status(500).json({ error: 'Failed to update current term' });
    }
};

module.exports = {
    setCurrentTerm,
};