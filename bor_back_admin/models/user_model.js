const db = require("../config/db");

const User = {
  // User keresése email alapján
  findByEmail: async (email) => {
    // Az adatbázisban password_hash van, nem jelszo!
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
        // A userData-ból érkezik a password_hash kulcs az auth_controller-től
        const { nev, email, password_hash, cim } = userData;
        
        // JAVÍTÁS: Az SQL-ben az oszlop neve password_hash!
        const [result] = await db.query(
            "INSERT INTO users (nev, email, password_hash, cim) VALUES (?, ?, ?, ?)",
            [nev, email, password_hash, cim]
        );
        
        // Fontos: vissza kell adni az új rekord ID-ját a controllernek
        return result.insertId; 
    },

  // User keresése ID alapján (me profilhoz)
  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT user_id, nev, email, cim, created_at FROM users WHERE user_id = ?", 
      [id]
    );
    return rows[0];
  },

  updateProfile: async (userId, nev) => {
    let sql = "UPDATE users SET nev = ? WHERE user_id = ?";
    const params = [nev, userId];
    return db.query(sql, params);
  },

  deleteAccount: async (userId) => {
    return db.query("DELETE FROM users WHERE user_id = ?", [userId]);
  }
};

module.exports = User;