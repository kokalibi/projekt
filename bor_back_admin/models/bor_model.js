const db = require("../config/db");

const Borok = {};

// ➤ ÖSSZES BOR
Borok.getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      b.*,
      p.nev AS pince_nev,
      f.nev AS fajta_nev,
      t.nev AS tipus_nev,
      e.evjarat
    FROM borok b
    JOIN pincek p ON b.pince_id = p.pince_id
    JOIN fajtak f ON b.fajta_id = f.fajta_id
    JOIN bor_tipusok t ON b.tipus_id = t.tipus_id
    JOIN evjaratok e ON b.evjarat_id = e.evjarat_id
    ORDER BY b.bor_id DESC
  `);

  return rows;
};

// ➤ EGY BOR
Borok.getById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      b.*,
      p.nev AS pince_nev,
      f.nev AS fajta_nev,
      t.nev AS tipus_nev,
      e.evjarat
    FROM borok b
    JOIN pincek p ON b.pince_id = p.pince_id
    JOIN fajtak f ON b.fajta_id = f.fajta_id
    JOIN bor_tipusok t ON b.tipus_id = t.tipus_id
    JOIN evjaratok e ON b.evjarat_id = e.evjarat_id
    WHERE b.bor_id = ?
  `, [id]);

  return rows[0];
};

module.exports = Borok;
