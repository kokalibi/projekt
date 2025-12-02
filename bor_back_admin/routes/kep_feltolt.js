const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

// ==========================
// KÉPMAPPA LÉTREHOZÁSA
// ==========================
const UPLOAD_DIR = path.join(__dirname, "../public/uploads/kep");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ==========================
// MULTER beállítás (MEMÓRIÁBA töltjük, hogy sharp tudja konvertálni)
// ==========================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// ==========================
// KÉPFELTÖLTÉS + JPG konverzió
// ==========================
router.post("/:id", upload.single("file"), async (req, res) => {
  try {
    const borId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "Nincs feltöltött fájl!" });
    }

    const outputPath = path.join(UPLOAD_DIR, `${borId}.jpg`);

    // SHARP → konvertálás + méretezés
    await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: "contain", background: "white" })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    res.json({
      message: "Kép sikeresen feltöltve és konvertálva",
      file: `${borId}.jpg`,
    });
  } catch (err) {
    console.error("Kép feltöltési hiba:", err);
    res.status(500).json({ error: "Kép mentése sikertelen" });
  }
});

module.exports = router;
