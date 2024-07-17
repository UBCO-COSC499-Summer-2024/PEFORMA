const imageService = require('../services/imageService');

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await imageService.getImageById(id);
    
    if (image) {
      res.contentType(`image/${image.file_type}`);
      res.send(image.image_data);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getImageById
};