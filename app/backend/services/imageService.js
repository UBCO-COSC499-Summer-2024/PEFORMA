const pool = require('../db/index.js');

const getImageById = async (id) => {
  const result = await pool.query('SELECT file_type, image_data FROM "Image" WHERE "imageId" = $1', [id]);
  return result.rows[0];
};

module.exports = {
  getImageById
};