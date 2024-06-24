const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx'); // For Excel
const csv = require('fast-csv'); // For CSV
const Joi = require('joi');  // For data validation
const pool = require('../db/index.js');

const router = express.Router(); // Create a router instance

const app = express();
const upload = multer({ dest: 'uploads/' });  

// Define validation schema for instructor data (example)
const instructorSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

app.use(express.json()); // Middleware to parse JSON bodies

// API endpoint to handle file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop();

    let data = [];
    if (fileExtension === 'xlsx') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (fileExtension === 'csv') {
      data = await new Promise((resolve, reject) => {
        const parsedData = [];
        fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', row => parsedData.push(row))
        .on('end', (rowCount) => {
            console.log(`Parsed ${rowCount} rows`);
            resolve(parsedData);
        });
      });
    } else {
      throw new Error('Unsupported file format');
    }
    
    await pool.query('BEGIN'); // Start transaction

    // Validate and insert/update data
    for (const row of data) {
      // Validate instructor data (example)
      if ('firstName' in row && 'lastName' in row) { // Assuming instructor data
        const { error, value } = instructorSchema.validate(row);
        if (error) {
          console.error('Validation error:', error);
          continue;
        }
      }
      
      // Insert or update into database (using pg or your preferred method)
      await pool.query(
        'INSERT INTO public."Profile" (firstName, lastName, email, phoneNum) VALUES ($1, $2, $3, $4)',
        [value.firstName, value.lastName, value.email, value.phoneNum] // Values from the validated data
      );
    }
    // 'INSERT INTO public."Profile" (firstName, lastName, email, phoneNum) VALUES ($1, $2, $3, $4) ON CONFLICT (UBCId) DO UPDATE SET ...',

    await pool.query('COMMIT'); // Commit transaction
    res.json({ message: 'Import successful!', numRecords: data.length });
  } catch (error) {
    console.error('Error importing data:', error);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Import failed!' });
  }
});

module.exports = router;


