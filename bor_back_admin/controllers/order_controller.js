// controllers/order_controller.js
const db = require("../config/db");

// ➤ MINDEN RENDELÉS LISTA
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM rendelesek ORDER BY rendeles_id DESC");
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
      "SELECT * FROM rendelesek WHERE rendeles_id = ?",
      [id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    console.error("order_controller getOrderById:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ ÚJ RENDELÉS (vendég + bejelentkezett)
exports.addOrder = async (req, res) => {
  try {
    const { nev, email, cim } = req.body;

    // ha be van jelentkezve → user_id
    const userId = req.user ? req.user.user_id : null;

    const [result] = await db.query(
      "INSERT INTO rendelesek (nev, email, cim, user_id) VALUES (?,?,?,?)",
      [nev, email, cim, userId]
    );

    res.json({ order_id: result.insertId });
  } catch (err) {
    console.error("order add error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
