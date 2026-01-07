const db = require("../config/db");

// ➤ RENDELÉS TÉTELEI
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT bor_nev, egysegar, mennyiseg
       FROM rendeles_tetelek
       WHERE rendeles_id = ?`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
