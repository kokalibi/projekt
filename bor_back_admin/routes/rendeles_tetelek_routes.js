const express = require("express");
const router = express.Router();

const orderItemsController = require("../controllers/order_items_controller");
const auth = require("../middleware/auth_middleware");
const adminOnly = require("../middleware/admin_only");

// RENDELÉS TÉTELEI (ADMIN)
router.get("/:id", orderItemsController.getOrderItems);


module.exports = router;
