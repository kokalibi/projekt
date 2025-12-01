const express = require("express");
const router = express.Router();
const controller = require("../controllers/order_controller");

router.get("/", controller.getAll);
router.get("/random", controller.getRandom);
router.get("/szures", controller.szures);
router.get("/:id", controller.getById);
router.post("/", controller.create);

module.exports = router;
