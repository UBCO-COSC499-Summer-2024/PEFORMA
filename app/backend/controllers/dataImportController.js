const dataImportService = require('../services/dataImportService');

async function uploadFile(req, res) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded', status: 'error' });
    }
    try {
        const importResult = await dataImportService.importData(req.files); //Execute service
        
        if (importResult.success) {
            res.status(200).json({ 
                message: 'Import successful!',
                status: 'success',
                importedCount: importResult.importedCount
            });
        } else {
            res.status(400).json({ 
                message: 'Import failed. Please check your file and try again.',
                status: 'error',
                errors: importResult.errors
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ 
            message: 'An unexpected error occurred during import.',
            status: 'error'
        });
    }
}

module.exports = {
    uploadFile
};