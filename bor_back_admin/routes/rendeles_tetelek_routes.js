const express = require("express");
const router = express.Router();
const orderItemsController = require("../controllers/order_items_controller");

// ➤ Egy rendelés tételei
router.get("/:id", orderItemsController.getOrderItems);

module.exports = router;
