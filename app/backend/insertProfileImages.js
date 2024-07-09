const pool = require('./db/index.js');
const fs = require('fs').promises;
const path = require('path');

async function insertImage(filePath) {
  const fileType = path.extname(filePath).slice(1).toLowerCase();
  let imageData;
  try {
    imageData = await fs.readFile(filePath);
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return;
  }

  const query = 'INSERT INTO "Image" (file_type, image_data) VALUES ($1, $2) RETURNING "imageId"';
  const values = [fileType, imageData];

  try {
    const res = await pool.query(query, values);
    console.log(`Inserted image with ID: ${res.rows[0].imageId}`);
  } catch (err) {
    console.error('Error inserting image:', err);
  }
}

async function insertImagesFromDirectory(directory) {
  console.log(`Attempting to read directory: ${directory}`);
  let files;
  try {
    files = await fs.readdir(directory);
    console.log(`Found ${files.length} files in the directory`);
  } catch (err) {
    console.error(`Error reading directory ${directory}:`, err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(directory, file);
    console.log(`Processing file: ${filePath}`);
    await insertImage(filePath);
  }

  console.log('All profile images processed');
}

async function checkImagesInserted() {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM "Image"');
    const count = parseInt(res.rows[0].count);
    console.log(`Number of images in the database: ${count}`);
    return count > 0;
  } catch (err) {
    console.error('Error checking if images are inserted:', err);
    return false;
  }
}

async function setupDatabase() {
  try {
    const imagesAlreadyInserted = await checkImagesInserted();
    if (!imagesAlreadyInserted) {
      console.log('Inserting profile images...');
      await insertImagesFromDirectory(path.join(__dirname, 'profile_images'));
    } else {
      console.log('Profile images already inserted, skipping...');
    }
  } catch (error) {
    console.error('Database setup error:', error);
  }
}

module.exports = { setupDatabase };