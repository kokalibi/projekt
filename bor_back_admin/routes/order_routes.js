// routes/order_routes.js
const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order_controller");
const auth = require("../middleware/auth_middleware"); // Ezt fogjuk használni a saját rendelésekhez
const adminOnly = require("../middleware/admin_only");
const authOptional = require("../middleware/auth_optional");

// --- FELHASZNÁLÓI (USER) ÚTVONALAK ---

// ➤ ÚJ: Bejelentkezett felhasználó saját rendeléseinek lekérése
// Fontos: Ennek a /:id elé kell kerülnie, különben a szerver a "my-orders"-t ID-nak hinné!
router.get("/my-orders", auth, orderController.getMyOrders);

// ➤ ÚJ: Egy konkrét rendelés tételeinek lekérése (Újrarendeléshez)
router.get("/items/:id", auth, orderController.getOrderItems);


// --- ADMINISZTRÁTORI ÚTVONALAK ---

// ➤ Minden rendelés (szűrőkkel)
router.get("/", orderController.getAllOrders);

// ➤ Egy rendelés részletei
router.get("/:id", orderController.getOrderById);

// ➤ Rendelés státuszának módosítása
router.put("/:id/status", orderController.updateStatus);


// --- RENDELÉS LEADÁSA ---

// ➤ Új rendelés — VENDÉG ÉS USER IS
router.post("/", authOptional, orderController.addOrder);

// ➤ Rendelés törlése (DELETE metódus)
router.delete("/:id", auth, adminOnly, orderController.deleteOrder);

module.exports = router;