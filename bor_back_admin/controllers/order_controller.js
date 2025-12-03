// controllers/order_controller.js
const db = require("../config/db");

// ➤ ÚJ RENDELÉS
exports.addOrder = async (req, res) => {
  try {
    const { nev, email, cim } = req.body;

    // ha be van jelentkezve → user_id
    const userId = req.user ? req.user.user_id : null;

    const [result] = await db.query(
      "INSERT INTO orders (nev, email, cim, user_id) VALUES (?,?,?,?)",
      [nev, email, cim, userId]
    );

    res.json({ order_id: result.insertId });
  } catch (err) {
    console.error("order add error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
