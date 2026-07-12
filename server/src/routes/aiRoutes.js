const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');
const path = require('path');
const os = require('os');

// Multer: store uploads temporarily in OS temp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `tryon-${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split('/')[1]);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Only JPEG, PNG and WebP images are allowed.'));
  },
});

// POST /api/ai/tryon
router.post(
  '/tryon',
  upload.fields([
    { name: 'userImage', maxCount: 1 },
    { name: 'garmentImage', maxCount: 1 },
  ]),
  aiController.processTryOn,
);

module.exports = router;
