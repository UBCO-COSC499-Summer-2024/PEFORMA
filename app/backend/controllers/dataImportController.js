// dataImportController.js
const dataImportService = require('../services/dataImportService');

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const importedData = await dataImportService.importData(req.file);
    res.json({ message: 'Import successful!', numRecords: importedData.length });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ 
        error: 'Import failed!', 
        details: error.message // More specific error details
    });
  }
};

module.exports = {
  uploadFile
};
