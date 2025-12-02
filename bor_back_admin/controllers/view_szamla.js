const db = require("../config/db");

// Számla nézet lekérése
exports.getSzamla = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM view_szamla WHERE order_id = ?",
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("view_szamla hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
