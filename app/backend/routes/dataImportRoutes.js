// dataImportRoutes.js
const express = require('express');
const multer = require('multer');
const dataImportController = require('../controllers/dataImportController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('files', 5), dataImportController.uploadFile);  // Accept multiple files up to a limit of 5

module.exports = router; 
