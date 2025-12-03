// routes/order_routes.js
const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order_controller");
const authOptional = require("../middleware/auth_optional");

// ➤ Minden rendelés (admin vagy későbbi felhasználó)
router.get("/", orderController.getAllOrders);

// ➤ Egy rendelés
router.get("/:id", orderController.getOrderById);

// ➤ Új rendelés — VENDÉG ÉS USER IS
router.post("/", authOptional, orderController.addOrder);

module.exports = router;
