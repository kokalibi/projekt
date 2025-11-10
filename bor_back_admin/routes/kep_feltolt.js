const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join('public', 'uploads', 'borok');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const borId = req.body.bor_id;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${borId}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  res.json({ message: 'Kép sikeresen feltöltve', file: req.file.filename });
});

module.exports = router;
