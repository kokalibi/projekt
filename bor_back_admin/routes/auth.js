// routes/auth.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth_controller");
const auth = require("../middleware/auth_middleware");


// publikus
router.post("/register", authController.register);
router.post("/login", authController.login);

// védett
router.get("/me", auth, authController.me);

module.exports = router;
