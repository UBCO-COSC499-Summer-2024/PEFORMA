// dataImportService.js
const xlsx = require('xlsx');
const csv = require('fast-csv');
const fs = require('fs');
const Joi = require('joi');
const pool = require('../db/index.js'); 

// Validation Schemas (Adapt to your actual database schema)
const profileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

// ...similar schemas for Course, ServiceRole, ServiceRoleByYear, etc.

async function importData(file) {
  const filePath = file.path;
  const fileExtension = file.originalname.split('.').pop();

  let data = [];

  if (fileExtension === 'xlsx') {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else if (fileExtension === 'csv') {
    data = await new Promise((resolve, reject) => {
      const parsedData = [];
      fs.createReadStream(filePath)
        .pipe(csv({ headers: true }))
        .on('data', row => parsedData.push(row))
        .on('end', () => resolve(parsedData))
        .on('error', error => reject(error));
    });
  } else {
    throw new Error('Unsupported file format');
  }

  // Start a database transaction
  await pool.query('BEGIN');

  try {
    for (const row of data) {
      // Determine data type (profile, course, etc.) based on column headers
      if ('firstName' in row && 'lastName' in row) {
        const { error, value } = profileSchema.validate(row);
        if (error) {
          console.error('Profile validation error:', error);
          continue;
        }

        // Insert or update profile
        await pool.query(`
          INSERT INTO public."Profile" ("firstName", "lastName")
          VALUES ($1, $2)
        `, [value.firstName, value.lastName]);
      } 
    }

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error; // Rethrow the error to be handled by the controller
  }
  
  return data; // Return the parsed and validated data
}

module.exports = {
  importData
};
