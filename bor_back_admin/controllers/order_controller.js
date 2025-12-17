const db = require("../config/db");

/**
 * ➤ MINDEN RENDELÉS (admin lista)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id,
        r.vegosszeg,
        r.fizetesi_mod,
        r.fizetesi_statusz,
        r.letrehozva,
        r.frissitve,
        rs.nev AS statusz_nev
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      ORDER BY r.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("getAllOrders hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

/**
 * ➤ EGY RENDELÉS FEJLÉC
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        r.*,
        rs.nev AS statusz_nev
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      WHERE r.id = ?
      `,
      [id]
    );

    res.json(rows[0] || {});
  } catch (err) {
    console.error("getOrderById hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

/**
 * ➤ ÚJ RENDELÉS (CHECKOUT)
 * - szallitasi cim
 * - szamlazasi cim
 * - rendeles
 * - rendeles tetelek
 * mindez TRANZAKCIÓBAN
 */
exports.addOrder = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const {
      szallitasi_cim,
      szamlazasi_cim,
      kosar,
      fizetesi_mod
    } = req.body;

    if (!szallitasi_cim || !kosar || kosar.length === 0) {
      return res.status(400).json({ error: "Hianyos adatok" });
    }

    await conn.beginTransaction();

    // 1️⃣ SZÁLLÍTÁSI CÍM
    const [szallitasi] = await conn.query(
      `
      INSERT INTO cimek
      (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2)
      VALUES (?,?,?,?,?,?,?,?)
      `,
      [
        szallitasi_cim.teljes_nev,
        szallitasi_cim.email || null,
        szallitasi_cim.telefon || null,
        szallitasi_cim.orszag,
        szallitasi_cim.varos,
        szallitasi_cim.iranyitoszam,
        szallitasi_cim.cim_sor1,
        szallitasi_cim.cim_sor2 || null
      ]
    );

    // 2️⃣ SZÁMLÁZÁSI CÍM (ha nincs, akkor a szállítási)
    let szamlazasiCimId = szallitasi.insertId;

    if (szamlazasi_cim) {
      const [szamlazasi] = await conn.query(
        `
        INSERT INTO cimek
        (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2)
        VALUES (?,?,?,?,?,?,?,?)
        `,
        [
          szamlazasi_cim.teljes_nev,
          szamlazasi_cim.email || null,
          szamlazasi_cim.telefon || null,
          szamlazasi_cim.orszag,
          szamlazasi_cim.varos,
          szamlazasi_cim.iranyitoszam,
          szamlazasi_cim.cim_sor1,
          szamlazasi_cim.cim_sor2 || null
        ]
      );

      szamlazasiCimId = szamlazasi.insertId;
    }

    // 3️⃣ VÉGÖSSZEG SZÁMÍTÁS
    const vegosszeg = kosar.reduce(
      (sum, item) => sum + item.egysegar * item.mennyiseg,
      0
    );

    // 4️⃣ RENDELÉS
    const [order] = await conn.query(
      `
      INSERT INTO rendelesek
      (statusz_id, vegosszeg, fizetesi_mod, fizetesi_statusz, szallitasi_cim_id, szamlazasi_cim_id)
      VALUES (1, ?, ?, 'fuggoben', ?, ?)
      `,
      [
        vegosszeg,
        fizetesi_mod || null,
        szallitasi.insertId,
        szamlazasiCimId
      ]
    );

    // 5️⃣ RENDELÉS TÉTELEK
    for (const item of kosar) {
      await conn.query(
        `
        INSERT INTO rendeles_tetelek
        (rendeles_id, bor_id, bor_nev, egysegar, mennyiseg)
        VALUES (?,?,?,?,?)
        `,
        [
          order.insertId,
          item.bor_id,
          item.bor_nev,
          item.egysegar,
          item.mennyiseg
        ]
      );
    }

    await conn.commit();

    res.json({
      rendeles_id: order.insertId,
      vegosszeg
    });

  } catch (err) {
    await conn.rollback();
    console.error("addOrder hiba:", err);
    res.status(500).json({ error: "Sikertelen rendelés" });
  } finally {
    conn.release();
  }
};

// ADMIN – rendelés státusz frissítés
// ADMIN – rendelés státusz frissítés
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusz_id } = req.body;

    if (!statusz_id) {
      return res.status(400).json({ error: "Hianyzo statusz_id" });
    }

    await db.query(
      "UPDATE rendelesek SET statusz_id = ? WHERE id = ?",
      [statusz_id, id]
    );

    res.json({ message: "Statusz frissitve" });
  } catch (err) {
    console.error("updateStatus error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

