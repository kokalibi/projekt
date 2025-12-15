// routes/auth.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth_controller");
const auth = require("../middleware/auth_middleware");

// publikus
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh); // 🔁 ÚJ
router.post("/logout", authController.logout);   // 🚪 ÚJ

// védett
router.get("/me", auth, authController.me);

module.exports = router;
