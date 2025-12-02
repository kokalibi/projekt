const db = require("../config/db");

// ➤ MINDEN RENDELÉS LISTA
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY order_id DESC");
    res.json(rows);
  } catch (err) {
    console.error("order_controller getAllOrders:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ EGY RENDELÉS
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    console.error("order_controller getOrderById:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ ÚJ RENDELÉS
exports.addOrder = async (req, res) => {
  try {
    const { nev, email, cim } = req.body;

    const [result] = await db.query(
      "INSERT INTO orders (nev, email, cim) VALUES (?, ?, ?)",
      [nev, email, cim]
    );

    res.json({ order_id: result.insertId });
  } catch (err) {
    console.error("order_controller addOrder:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
