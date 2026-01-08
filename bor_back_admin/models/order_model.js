const db = require("../config/db");

const Order = {
  // Összes rendelés listázása adminnak
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        r.id, r.vegosszeg, r.fizetesi_mod, r.fizetesi_statusz, r.letrehozva,
        rs.nev AS statusz_nev, c.teljes_nev AS vevo_nev
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      JOIN cimek c ON r.szallitasi_cim_id = c.id
      ORDER BY r.id DESC
    `);
    return rows;
  },

  // Egy rendelés alapadatai
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT r.*, rs.nev AS statusz_nev
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  },

  // Rendelés tételeinek lekérése
  getItems: async (id) => {
    const [rows] = await db.query(`
      SELECT bor_nev, egysegar, mennyiseg
      FROM rendeles_tetelek
      WHERE rendeles_id = ?
    `, [id]);
    return rows;
  },

  // Státusz frissítése
  updateStatus: async (id, statusz_id) => {
    return await db.query("UPDATE rendelesek SET statusz_id = ? WHERE id = ?", [statusz_id, id]);
  },

  // Új rendelés leadása (Tranzakcióval)
  create: async (data) => {
    const { szallitasi_cim, szamlazasi_cim, kosar, fizetesi_mod, vegosszeg } = data;
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();

      // 1. Szállítási cím
      const [szallRes] = await conn.query(
        "INSERT INTO cimek (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2) VALUES (?,?,?,?,?,?,?,?)",
        [szallitasi_cim.teljes_nev, szallitasi_cim.email || null, szallitasi_cim.telefon || null, szallitasi_cim.orszag, szallitasi_cim.varos, szallitasi_cim.iranyitoszam, szallitasi_cim.cim_sor1, szallitasi_cim.cim_sor2 || null]
      );
      const szallitasiCimId = szallRes.insertId;

      // 2. Számlázási cím
      let szamlazasiCimId = szallitasiCimId;
      if (szamlazasi_cim) {
        const [szamlRes] = await conn.query(
          "INSERT INTO cimek (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2) VALUES (?,?,?,?,?,?,?,?)",
          [szamlazasi_cim.teljes_nev, szamlazasi_cim.email || null, szamlazasi_cim.telefon || null, szamlazasi_cim.orszag, szamlazasi_cim.varos, szamlazasi_cim.iranyitoszam, szamlazasi_cim.cim_sor1, szamlazasi_cim.cim_sor2 || null]
        );
        szamlazasiCimId = szamlRes.insertId;
      }

      // 3. Rendelés
      const [orderRes] = await conn.query(
        "INSERT INTO rendelesek (statusz_id, vegosszeg, fizetesi_mod, fizetesi_statusz, szallitasi_cim_id, szamlazasi_cim_id) VALUES (1, ?, ?, 'fuggoben', ?, ?)",
        [vegosszeg, fizetesi_mod || null, szallitasiCimId, szamlazasiCimId]
      );
      const orderId = orderRes.insertId;

      // 4. Tételek
      for (const item of kosar) {
        await conn.query(
          "INSERT INTO rendeles_tetelek (rendeles_id, bor_id, bor_nev, egysegar, mennyiseg) VALUES (?,?,?,?,?)",
          [orderId, item.bor_id, item.bor_nev, item.egysegar, item.mennyiseg]
        );
      }

      await conn.commit();
      return { orderId, vegosszeg };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = Order;