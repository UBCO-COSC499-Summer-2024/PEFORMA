// app/backend/insert_images.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

async function insertImage(filePath) {
  const fileType = path.extname(filePath).slice(1).toLowerCase();
  const imageData = fs.readFileSync(filePath);

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
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    await insertImage(filePath);
  }

  console.log('All profile images inserted');
  await pool.end();
}

async function checkImagesInserted() {
  const res = await pool.query('SELECT COUNT(*) FROM "Image"');
  return parseInt(res.rows[0].count) > 0;
}

async function main() {
  const imagesAlreadyInserted = await checkImagesInserted();
  if (!imagesAlreadyInserted) {
    console.log('Inserting profile images...');
    await insertImagesFromDirectory('/app/profile_images');
  } else {
    console.log('Profile images already inserted, skipping...');
  }
  await pool.end();
}

main().catch(console.error);