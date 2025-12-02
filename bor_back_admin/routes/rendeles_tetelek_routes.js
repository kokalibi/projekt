const express = require("express");
const router = express.Router();
const orderItemsController = require("../controllers/order_items_controller");

// ➤ Egy rendelés tételei
router.get("/:id", orderItemsController.getOrderItems);

// ➤ Új rendeléstétel hozzáadása
router.post("/", orderItemsController.addOrderItem);

module.exports = router;
