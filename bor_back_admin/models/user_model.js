const db = require("../config/db");

const User = {
  // User keresése email alapján
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  // Admin keresése email alapján
  findAdminByEmail: async (email) => {
    const [rows] = await db.query("SELECT id, email, jelszo, nev FROM adminok WHERE email = ?", [email]);
    return rows[0];
  },

  // Új felhasználó mentése
  create: async (userData) => {
    const { nev, email, hash, cim } = userData;
    const [result] = await db.query(
      "INSERT INTO users (nev, email, password_hash, cim) VALUES (?,?,?,?)",
      [nev, email, hash, cim || null]
    );
    return result.insertId;
  },

  // User keresése ID alapján (me profilhoz)
  findById: async (id) => {
    const [rows] = await db.query("SELECT user_id, nev, email, cim, created_at FROM users WHERE user_id = ?", [id]);
    return rows[0];
  }
};

module.exports = User;