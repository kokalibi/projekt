// controllers/order_items_controller.js
const Order = require("../models/order_model");

// ➤ RENDELÉS TÉTELEI
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;

    // A modellt hívjuk meg az adatbázis kérés helyett
    const items = await Order.getItems(id);

    res.json(items);
  } catch (err) {
    console.error("getOrderItems hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};