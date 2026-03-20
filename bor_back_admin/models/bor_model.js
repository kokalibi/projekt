const db = require("../config/db");

const Borok = {};

Borok.getAll = async (filters = {}) => {
  const { search, tipus, fajta, pince, evjarat } = filters;
  let query = `
    SELECT 
      b.*,
      p.nev AS pince_nev,
      p.telefon AS pince_telefon, -- ÚJ MEZŐ
      p.email AS pince_email,     -- ÚJ MEZŐ
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

  if (search) {
    query += " AND b.nev LIKE ?";
    params.push(`%${search}%`);
  }
  if (tipus) {
    query += " AND t.nev = ?";
    params.push(tipus);
  }
  if (fajta) {
    query += " AND f.nev = ?";
    params.push(fajta);
  }
  if (pince) {
    query += " AND p.nev = ?";
    params.push(pince);
  }
  if (evjarat) {
    query += " AND e.evjarat = ?";
    params.push(evjarat);
  }

  query += " ORDER BY b.bor_id DESC";

  const [rows] = await db.query(query, params);
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
