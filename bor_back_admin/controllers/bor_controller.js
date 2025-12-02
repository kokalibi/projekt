const db = require("../config/db");
const Borok = require("../models/bor_model");

// ➤ ÖSSZES BOR
exports.getBorok = async (req, res) => {
  try {
    const rows = await Borok.getAll();
    res.json(rows);
  } catch (err) {
    console.error("bor_controller getBorok:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ EGY BOR
exports.getBor = async (req, res) => {
  try {
    const bor = await Borok.getById(req.params.id);
    res.json(bor);
  } catch (err) {
    console.error("bor_controller getBor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ ÚJ BOR
exports.addBor = async (req, res) => {
  try {
    const {
      nev,
      evjarat_id,
      alkohol_fok,
      ar,
      leiras,
      pince_id,
      fajta_id,
      tipus_id,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO borok 
      (nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id]
    );

    res.json({ bor_id: result.insertId });
  } catch (err) {
    console.error("bor_controller addBor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ BOR TÖRLÉSE
exports.deleteBor = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM borok WHERE bor_id = ?", [id]);

    res.json({ message: "Bor törölve" });
  } catch (err) {
    console.error("bor_controller deleteBor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// ➤ BOR FRISSÍTÉSE
exports.updateBor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nev,
      evjarat_id,
      alkohol_fok,
      ar,
      leiras,
      pince_id,
      fajta_id,
      tipus_id,
    } = req.body;

    await db.query(
      `
      UPDATE borok SET
        nev = ?, 
        evjarat_id = ?, 
        alkohol_fok = ?, 
        ar = ?, 
        leiras = ?, 
        pince_id = ?, 
        fajta_id = ?, 
        tipus_id = ?
      WHERE bor_id = ?
    `,
      [nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id, id]
    );

    res.json({ message: "Bor frissítve" });
  } catch (err) {
    console.error("bor_controller updateBor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
