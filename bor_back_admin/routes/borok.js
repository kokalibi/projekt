const express = require("express");
const router = express.Router();
const borController = require("../controllers/bor_controller");

// ➤ ÖSSZES BOR
router.get("/", borController.getBorok);

// ➤ EGY BOR
router.get("/:id", borController.getBor);

// ➤ ÚJ BOR
router.post("/", borController.addBor);

// ➤ BOR TÖRLÉSE
router.delete("/:id", borController.deleteBor);

// ➤ BOR FRISSÍTÉSE
router.put("/:id", borController.updateBor);

module.exports = router;
