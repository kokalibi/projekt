const pool = require('../config/db');

const Borok = {};

Borok.getAll = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM borok");
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.getByKezdoBetuk = async (kezdo) => {
  try {
    const [rows] = await pool.query("SELECT * FROM borok WHERE nev LIKE ?", [kezdo + '%']);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

Borok.addBor = async (bor) => {
  try {
    const { nev, evjarat_id, alkohol_fok, ar, leiras, pince_id, fajta_id, tipus_id } = bor;
    const [result] = await pool.query(
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
    await pool.query(`DELETE FROM borok WHERE bor_id = ?`, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = Borok;
