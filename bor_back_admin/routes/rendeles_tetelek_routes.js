const express = require("express");
const router = express.Router();
const controller = require("../controllers/order_items_controller");

router.get("/:id", controller.getByOrderId);
router.post("/", controller.addItem);

module.exports = router;
