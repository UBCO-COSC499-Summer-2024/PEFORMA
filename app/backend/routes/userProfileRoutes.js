const express = require('express');
const multer = require('multer');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:profileId', (req, res, next) => {
  console.log('Route handler for profile GET reached. ProfileId:', req.params.profileId);
  next();
}, userProfileController.getUserProfile);

router.put('/:profileId', upload.single('image'), (req, res, next) => {
  console.log('Route handler for profile PUT reached. ProfileId:', req.params.profileId);
  next();
}, userProfileController.updateUserProfile);

module.exports = router;