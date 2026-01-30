const express = require('express');
const router = express.Router();
const bulkController = require('../controllers/host/BulkProductController');
const { hostMiddleware } = require('../middleware/tokenVerify');
const multer = require('multer');
const path = require('path');

// Configure multer for temporary CSV storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed!'), false);
        }
    }
});

router.post('/bulk-upload', hostMiddleware, upload.single('csvFile'), bulkController.uploadBulkProducts);
router.patch('/bulk-update-price', hostMiddleware, bulkController.bulkUpdatePrice);

module.exports = router;
