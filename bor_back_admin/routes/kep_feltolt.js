// routes/kep_feltolt.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../public/uploads/kep");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const borId = req.params.bor_id || req.body.bor_id;
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    if (!borId) {
      // ha nincs bor_id, hibát dobunk
      return cb(new Error("Missing bor_id"));
    }
    cb(null, `${borId}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/:bor_id?', upload.single('kep'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nincs feltöltött kép (field: kep)" });
  }
  res.json({ message: "Kép feltöltve", filename: req.file.filename });
});

module.exports = router;
