const db = require("../config/db");

const Order = {
  // 1. ADMIN: Összes rendelés lekérése
  getAll: async (filters = {}) => {
    const { id, vevo, datum, fizetes } = filters;
    let sql = `
      SELECT r.id, r.vegosszeg, fm.megnevezes AS fizetesi_mod, r.letrehozva,
             rs.nev AS statusz_nev, r.statusz_id, c.teljes_nev AS vevo_nev
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      JOIN cimek c ON r.szallitasi_cim_id = c.id
      LEFT JOIN fizetesi_modok fm ON r.fizetesi_mod_id = fm.id 
      WHERE 1=1
    `;
    const params = [];
    if (id) { sql += " AND r.id = ?"; params.push(id); }
    if (vevo) { sql += " AND c.teljes_nev LIKE ?"; params.push(`%${vevo}%`); }
    if (datum) { sql += " AND r.letrehozva LIKE ?"; params.push(`%${datum}%`); }
    if (fizetes) { sql += " AND fm.megnevezes LIKE ?"; params.push(`%${fizetes}%`); }

    sql += " ORDER BY r.id DESC";
    const [rows] = await db.query(sql, params);
    return rows;
  },

  // 2. ADMIN/USER: Részletes adatok
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT r.*, rs.nev AS statusz_nev, fm.megnevezes AS fizetesi_mod_nev,
             szall.teljes_nev AS szall_nev, szall.varos AS szall_varos, szall.cim_sor1 AS szall_utca
      FROM rendelesek r
      JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
      LEFT JOIN fizetesi_modok fm ON r.fizetesi_mod_id = fm.id
      JOIN cimek szall ON r.szallitasi_cim_id = szall.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  },

  // 3. USER: Saját rendelések EMAIL alapján (Mennyiséggel és fizetési móddal)
  getByUserEmail: async (email) => {
  const [rows] = await db.query(`
    SELECT 
      r.id, 
      r.vegosszeg, 
      r.letrehozva, 
      rs.nev AS statusz_nev,
      r.statusz_id,
      fm.megnevezes AS fizetesi_mod,
      (SELECT GROUP_CONCAT(CONCAT(rt.bor_nev, ' × ', rt.mennyiseg) SEPARATOR '|') 
       FROM rendeles_tetelek rt 
       WHERE rt.rendeles_id = r.id) AS borok_raw
    FROM rendelesek r
    JOIN rendeles_statuszok rs ON r.statusz_id = rs.id
    JOIN cimek c ON r.szallitasi_cim_id = c.id
    LEFT JOIN fizetesi_modok fm ON r.fizetesi_mod_id = fm.id
    WHERE c.email = ?
    ORDER BY r.id DESC
  `, [email]);
  return rows;
},

  // 4. USER: Rendelés tételei (Újrarendeléshez)
  getItems: async (id) => {
    const [rows] = await db.query(`
      SELECT bor_id, bor_nev, egysegar, mennyiseg
      FROM rendeles_tetelek
      WHERE rendeles_id = ?
    `, [id]);
    return rows;
  },

  updateStatus: async (id, statusz_id) => {
    return await db.query("UPDATE rendelesek SET statusz_id = ? WHERE id = ?", [statusz_id, id]);
  },

  // 5. Rendszer: Új rendelés létrehozása
  create: async (data) => {
    const { szallitasi_cim, szamlazasi_cim, kosar, fizetesi_mod_id, vegosszeg } = data;
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [szallRes] = await conn.query(
        "INSERT INTO cimek (teljes_nev, email, telefon, orszag, varos, iranyitoszam, cim_sor1, cim_sor2) VALUES (?,?,?,?,?,?,?,?)",
        [szallitasi_cim.teljes_nev, szallitasi_cim.email, szallitasi_cim.telefon, szallitasi_cim.orszag, szallitasi_cim.varos, szallitasi_cim.iranyitoszam, szallitasi_cim.cim_sor1, szallitasi_cim.cim_sor2]
      );
      const szallitasiCimId = szallRes.insertId;

      const [orderRes] = await conn.query(
        "INSERT INTO rendelesek (statusz_id, vegosszeg, fizetesi_mod_id, szallitasi_cim_id) VALUES (1, ?, ?, ?)",
        [vegosszeg, fizetesi_mod_id, szallitasiCimId]
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
  },
  delete: async (id) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Töröljük a tételeket, amik ehhez a rendeléshez tartoznak
      await conn.query("DELETE FROM rendeles_tetelek WHERE rendeles_id = ?", [id]);

      // 2. Töröljük magát a rendelést
      const [result] = await conn.query("DELETE FROM rendelesek WHERE id = ?", [id]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = Order;