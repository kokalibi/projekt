const adminpool = require('../config/db');

const Borok = {};

Borok.getAll = async () => {
  try {
    const [rows] = await adminpool.query(`
      SELECT b.*, p.nev AS pince_nev, f.nev AS fajta_nev, t.nev AS tipus_nev, e.evjarat
      FROM borok b
      JOIN pincek p ON b.pince_id = p.pince_id
      JOIN fajták f ON b.fajta_id = f.fajta_id
      JOIN bor_tipusok t ON b.tipus_id = t.tipus_id
      JOIN evjaratok e ON b.evjarat_id = e.evjarat_id
      ORDER BY b.bor_id DESC
    `);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.getByKezdoBetuk = async (kezdo) => {
  try {
    const [rows] = await adminpool.query(
      "SELECT * FROM borok WHERE nev LIKE ?",
      [kezdo + '%']
    );
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.addBor = async (bor) => {
  try {
    const { nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id } = bor;
    const [result] = await adminpool.query(
      `INSERT INTO borok (nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id]
    );
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.deleteBor = async (id) => {
  try {
    await adminpool.query("DELETE FROM borok WHERE bor_id = ?", [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.getByTipusNev = async (tipus_nev) => {
  try {
    const [rows] = await adminpool.query(`
      SELECT b.*
      FROM borok b
      JOIN bor_tipusok t ON b.tipus_id = t.tipus_id
      WHERE t.nev LIKE ?`, [tipus_nev]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.getByFajtaNev = async (fajta_nev) => {
  try {
    const [rows] = await adminpool.query(`
      SELECT b.*
      FROM borok b
      JOIN fajták f ON b.fajta_id = f.fajta_id
      WHERE f.nev LIKE ?`, [fajta_nev]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.getByEvjarat = async (evjarat) => {
  try {
    const [rows] = await adminpool.query(`
      SELECT b.*
      FROM borok b
      JOIN evjaratok e ON b.evjarat_id = e.evjarat_id
      WHERE e.evjarat = ?`, [evjarat]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.getByPinceNev = async (pince_nev) => {
  try {
    const [rows] = await adminpool.query(`
      SELECT b.*
      FROM borok b
      JOIN pincek p ON b.pince_id = p.pince_id
      WHERE p.nev LIKE ?`, [pince_nev]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = Borok;
