const express = require('express');
const multer = require('multer');
const userProfileUpdateController = require('../../controllers/UpdateInfo/userProfileUpdateController');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.put('/:profileId', upload.single('image'), userProfileUpdateController.updateUserProfile);

module.exports = router;