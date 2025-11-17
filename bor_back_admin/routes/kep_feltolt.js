
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../public/uploads/kep");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const allowedMime = ["image/jpeg", "image/jpg", "image/png"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const borId = req.params.bor_id || req.body.bor_id;
    if (!borId) return cb(new Error("Hiányzik a bor_id"));

    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${borId}${ext}`);
  }
});


const fileFilter = (req, file, cb) => {
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Csak JPG vagy PNG formátum engedélyezett!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});


router.post("/:bor_id?", upload.single("kep"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nincs feltöltött kép." });
  }
  res.json({
    message: "Kép sikeresen feltöltve!",
    filename: req.file.filename
  });
});

module.exports = router;
