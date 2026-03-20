const db = require("../config/db");

// Adatbázis műveletek (Model)
const BaseData = {
  // LEKÉRDEZÉSEK (GET)
  // A pincéknél joinoljuk az ország nevét is a listához
  getAllPince: async () => {
    const [rows] = await db.query(`
      SELECT p.*, o.nev AS orszag_nev 
      FROM pincek p 
      LEFT JOIN orszagok o ON p.orszag_id = o.orszag_id 
      ORDER BY p.nev
    `);
    return rows;
  },
  getAllOrszagok: async () => {
    const [rows] = await db.query("SELECT * FROM orszagok ORDER BY nev");
    return rows;
  },
  getAllFajta: async () => {
    const [rows] = await db.query("SELECT * FROM fajtak ORDER BY nev");
    return rows;
  },
  getAllTipus: async () => {
    const [rows] = await db.query("SELECT * FROM bor_tipusok ORDER BY nev");
    return rows;
  },
  getAllEvjarat: async () => {
    const [rows] = await db.query("SELECT * FROM evjaratok ORDER BY evjarat DESC");
    return rows;
  },

  // LÉTREHOZÁS (POST)
  createPince: async (p) => {
    return db.query(
      "INSERT INTO pincek (nev, telepules, cim, telefon, email, weboldal, orszag_id) VALUES (?,?,?,?,?,?,?)",
      [p.nev, p.telepules, p.cim, p.telefon || '', p.email || '', p.weboldal || '', p.orszag_id]
    );
  },
  createOrszag: async (nev) => {
    return db.query("INSERT INTO orszagok (nev) VALUES (?)", [nev]);
  },
  createFajta: async (f) => {
    return db.query("INSERT INTO fajtak (nev, szin) VALUES (?, ?)", [f.nev, f.szin]);
  },
  createTipus: async (nev) => {
    return db.query("INSERT INTO bor_tipusok (nev) VALUES (?)", [nev]);
  },
  createEvjarat: async (ev) => {
    return db.query("INSERT INTO evjaratok (evjarat) VALUES (?)", [ev]);
  },

  // TÖRLÉS (DELETE)
  deletePince: async (id) => db.query("DELETE FROM pincek WHERE pince_id = ?", [id]),
  deleteOrszag: async (id) => db.query("DELETE FROM orszagok WHERE orszag_id = ?", [id]),
  deleteFajta: async (id) => db.query("DELETE FROM fajtak WHERE fajta_id = ?", [id]),
  deleteTipus: async (id) => db.query("DELETE FROM bor_tipusok WHERE tipus_id = ?", [id]),
  deleteEvjarat: async (id) => db.query("DELETE FROM evjaratok WHERE evjarat_id = ?", [id])
};

module.exports = BaseData;