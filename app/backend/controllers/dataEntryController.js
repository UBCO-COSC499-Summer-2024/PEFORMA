const dataEntryService = require('../services/dataEntry');
async function saveDataToDatabase (req, res) {
    const data = req.body;
    try {
        await dataEntryService.saveDataToDatabase(data);//Execute service
        res.status(200).send('Data successfully saved');
    } catch (error) {
        res.status(500).send(`Failed to save data.Error Message:${error.message}`);
    }
};
module.exports = {
    saveDataToDatabase
}