const db = require("../config/db");

const Order = {
  // Összes rendelés listázása adminnak
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        r.id, 
        r.vegosszeg, 
        fm.megnevezes AS fizetesi_mod, 
        r.letrehozva,
        rs.nev AS statusz_nev, 
        c.teljes_nev AS vevo_nev
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      JOIN cimek c ON r.szallitasi_cim_id = c.id
      LEFT JOIN fizetesi_modok fm ON r.fizetesi_mod_id = fm.id 
      ORDER BY r.id DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        r.*, 
        rs.nev AS statusz_nev,
        fm.megnevezes AS fizetesi_mod_nev,
        szall.teljes_nev AS szall_nev, szall.iranyitoszam AS szall_irsz, szall.varos AS szall_varos, szall.cim_sor1 AS szall_utca,
        szaml.teljes_nev AS szaml_nev, szaml.iranyitoszam AS szaml_irsz, szaml.varos AS szaml_varos, szaml.cim_sor1 AS szaml_utca
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      LEFT JOIN fizetesi_modok fm ON r.fizetesi_mod_id = fm.id
      JOIN cimek szall ON r.szallitasi_cim_id = szall.id
      LEFT JOIN cimek szaml ON r.szamlazasi_cim_id = szaml.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  },

  getItems: async (id) => {
    const [rows] = await db.query(`
      SELECT bor_nev, egysegar, mennyiseg
      FROM rendeles_tetelek
      WHERE rendeles_id = ?
    `, [id]);
    return rows;
  },

  updateStatus: async (id, statusz_id) => {
    return await db.query("UPDATE rendelesek SET statusz_id = ? WHERE id = ?", [statusz_id, id]);
  },

  create: async (data) => {
    const { szallitasi_cim, szamlazasi_cim, kosar, fizetesi_mod_id, vegosszeg } = data;
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();

      // 1. Szállítási cím mentése
      const [szallRes] = await conn.query(
        "INSERT INTO cimek (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2) VALUES (?,?,?,?,?,?,?,?)",
        [szallitasi_cim.teljes_nev, szallitasi_cim.email || '', szallitasi_cim.telefon || '', szallitasi_cim.orszag, szallitasi_cim.varos, szallitasi_cim.iranyitoszam, szallitasi_cim.cim_sor1, szallitasi_cim.cim_sor2 || null]
      );
      const szallitasiCimId = szallRes.insertId;

      // 2. Számlázási cím mentése (Mindig küldünk emailt/telefont, mert NOT NULL az SQL-ben)
      let szamlazasiCimId = szallitasiCimId;
      if (szamlazasi_cim && JSON.stringify(szamlazasi_cim) !== JSON.stringify(szallitasi_cim)) {
        const [szamlRes] = await conn.query(
          "INSERT INTO cimek (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2) VALUES (?,?,?,?,?,?,?,?)",
          [szamlazasi_cim.teljes_nev, szamlazasi_cim.email || '', szamlazasi_cim.telefon || '', szamlazasi_cim.orszag, szamlazasi_cim.varos, szamlazasi_cim.iranyitoszam, szamlazasi_cim.cim_sor1, szamlazasi_cim.cim_sor2 || null]
        );
        szamlazasiCimId = szamlRes.insertId;
      }

      // 3. Rendelés mentése (fizetesi_statusz nélkül, mert nincs a tábládban)
      const [orderRes] = await conn.query(
        "INSERT INTO rendelesek (statusz_id, vegosszeg, fizetesi_mod_id, szallitasi_cim_id, szamlazasi_cim_id) VALUES (1, ?, ?, ?, ?)",
        [vegosszeg, fizetesi_mod_id, szallitasiCimId, szamlazasiCimId]
      );
      const orderId = orderRes.insertId;

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