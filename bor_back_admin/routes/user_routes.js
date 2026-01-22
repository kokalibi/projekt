const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const auth = require("../middleware/auth_middleware");
const multer = require("multer");
const path = require("path");

// Multer konfiguráció a képfeltöltéshez
const storage = multer.diskStorage({
  // A mappa neve 'feltoltesek' lett
  destination: "./feltoltesek/profil/", 
  filename: (req, file, cb) => {
    cb(null, `user_${req.user.user_id}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit: 2MB
});

// Útvonalak összekötése a kontroller függvényeivel
router.get("/me", auth, userController.getMe);
router.put("/update", auth, upload.single("image"), userController.updateProfile);
router.delete("/delete", auth, userController.deleteMe);

module.exports = router;