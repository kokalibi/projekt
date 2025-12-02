const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order_controller");

// ➤ Minden rendelés lekérése
router.get("/", orderController.getAllOrders);

// ➤ Egy rendelés lekérése
router.get("/:id", orderController.getOrderById);

// ➤ Új rendelés létrehozása
router.post("/", orderController.addOrder);

module.exports = router;
