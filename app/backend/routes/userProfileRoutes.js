const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

router.get('/:profileId', (req, res, next) => {
  console.log('Route handler for profile reached. ProfileId:', req.params.profileId);
  next();
}, userProfileController.getUserProfile);

module.exports = router;