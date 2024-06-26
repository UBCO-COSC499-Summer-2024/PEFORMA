// dataImportRoutes.js
const express = require('express');
const multer = require('multer');
const dataImportController = require('../controllers/dataImportController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), dataImportController.uploadFile);

module.exports = router;
