// routes/order_routes.js
const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order_controller");
const auth = require("../middleware/auth_middleware");
const adminOnly = require("../middleware/admin_only");
const authOptional = require("../middleware/auth_optional");

// ➤ Minden rendelés (admin vagy későbbi felhasználó)
router.get("/", orderController.getAllOrders);

// ➤ Egy rendelés
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", orderController.updateStatus);


// ➤ Új rendelés — VENDÉG ÉS USER IS
router.post("/", authOptional, orderController.addOrder);

module.exports = router;
