const dataImportService = require('../services/dataImportService');
const pool = require('../db/index.js');

async function uploadFile(req, res) {
	if (!req.files || req.files.length === 0) { // Check for existence of files
		return res.status(400).json({ error: 'No files uploaded' });
	}
	try {
		await pool.query('BEGIN'); // Start a database transaction
		const importedData = []; // Array to track imported data
		for (const file of req.files) {
			// Call the service function for each file
			const fileData = await dataImportService.importData(file);
			importedData.push(...fileData); // Append the data from each file to the array
		}

		await pool.query('COMMIT'); // Commit the transaction
		const numRecords = importedData.length;
		console.log(importedData);

		if (importedData.length === 0) {
			return res.status(200).json({ message: 'No new or updated data found in the file.' });
		} else {
			res.json({ message: 'Import successful!', numRecords: numRecords });
		}
	} catch (error) {
		await pool.query('ROLLBACK');
		console.error('Error importing data:', error);
		res.status(500).json({ error: 'Import failed!', details: error.message }); // Include error details
	}
};

module.exports = {
	uploadFile
};
