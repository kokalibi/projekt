const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/uploads/kep",
  filename: (req, file, cb) => {
    cb(null, req.body.bor_id + ".jpg");
  },
});

const upload = multer({ storage });

router.post("/", upload.single("kep"), (req, res) => {
  res.json({ message: "Kép feltöltve" });
});

module.exports = router;
