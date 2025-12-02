const db = require("../config/db");

// ➤ TÉTELEK LEKÉRÉSE
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("order_items_controller hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ ÚJ TÉTEL
exports.addOrderItem = async (req, res) => {
  try {
    const { order_id, bor_id, mennyiseg } = req.body;

    const [result] = await db.query(
      "INSERT INTO order_items (order_id, bor_id, mennyiseg) VALUES (?, ?, ?)",
      [order_id, bor_id, mennyiseg]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("order_items_controller hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
