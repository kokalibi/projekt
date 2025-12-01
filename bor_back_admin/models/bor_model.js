const pool = require("../config/db");

const Borok = {};

// ───────────────────────────────────────────
//  Összes bor (JOIN-okkal együtt)
// ───────────────────────────────────────────
Borok.getAll = async () => {
  const [rows] = await pool.query(`
    SELECT b.*, 
           p.nev AS pince_nev, 
           f.nev AS fajta_nev, 
           t.nev AS tipus_nev, 
           e.evjarat
    FROM borok b
    JOIN pincek p ON b.pince_id = p.pince_id
    JOIN fajtak f ON b.fajta_id = f.fajta_id
    JOIN bor_tipusok t ON b.tipus_id = t.tipus_id
    JOIN evjaratok e ON b.evjarat_id = e.evjarat_id
    LIMIT ? OFFSET ?
    `, [limit, offset]);
};

// ───────────────────────────────────────────
//  Név szerinti keresés
// ───────────────────────────────────────────
Borok.getByKezdoBetuk = async (kezdo) => {
  const [rows] = await pool.query(
    `SELECT * FROM borok WHERE nev LIKE ?`,
    [kezdo + "%"]
  );
  return rows;
};

// ───────────────────────────────────────────
//  Bor hozzáadása
// ───────────────────────────────────────────
Borok.addBor = async (bor) => {
  const {
    nev,
    evjarat_id,
    alkohol_fok,
    ar,
    leiras,
    pince_id,
    fajta_id,
    tipus_id,
  } = bor;

  const [result] = await pool.query(
    `
      INSERT INTO borok 
      (nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id]
  );

  return result.insertId;
};

// ───────────────────────────────────────────
//  Bor törlése
// ───────────────────────────────────────────
Borok.deleteBor = async (id) => {
  await pool.query("DELETE FROM borok WHERE bor_id = ?", [id]);
};

// ───────────────────────────────────────────
//  Bor részletei ID alapján
// ───────────────────────────────────────────
Borok.getById = async (id) => {
  const [rows] = await pool.query(
    `
      SELECT b.*, 
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
    `,
    [id]
  );

  return rows[0];
};

// ───────────────────────────────────────────
//  🔥 ÚJ – Többfeltételes szűrés
// ───────────────────────────────────────────
Borok.szures = async ({ pince_nev, fajta_nev, tipus_nev, evjarat }) => {
  let sql = `
    SELECT b.*, 
           p.nev AS pince_nev, 
           f.nev AS fajta_nev, 
           t.nev AS tipus_nev, 
           e.evjarat
    FROM borok b
    JOIN pincek p ON b.pince_id = p.pince_id
    JOIN fajtak f ON b.fajta_id = f.fajta_id
    JOIN bor_tipusok t ON b.tipus_id = t.tipus_id
    JOIN evjaratok e ON b.evjarat_id = e.evjarat_id
    WHERE 1=1
  `;

  const params = [];

  if (pince_nev) {
    sql += " AND p.nev = ?";
    params.push(pince_nev);
  }

  if (fajta_nev) {
    sql += " AND f.nev = ?";
    params.push(fajta_nev);
  }

  if (tipus_nev) {
    sql += " AND t.nev = ?";
    params.push(tipus_nev);
  }

  if (evjarat) {
    sql += " AND e.evjarat = ?";
    params.push(evjarat);
  }

  sql += " ORDER BY b.bor_id ASC";

  const [rows] = await pool.query(sql, params);
  return rows;
};

Borok.updateBor = async (id, adat) => {
  try {
    const {
      nev,
      evjarat_id,
      alkohol_fok,
      ar,
      leiras,
      pince_id,
      fajta_id,
      tipus_id
    } = adat;

    await pool.query(
      `UPDATE borok SET
        nev = ?,
        evjarat_id = ?,
        alkohol_fok = ?,
        ar = ?,
        leiras = ?,
        pince_id = ?,
        fajta_id = ?,
        tipus_id = ?
      WHERE bor_id = ?`,
      [
        nev,
        evjarat_id,
        alkohol_fok,
        ar,
        leiras,
        pince_id,
        fajta_id,
        tipus_id,
        id
      ]
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};


module.exports = Borok;
