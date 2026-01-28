const User = require("../models/user_model");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Felhasználói adatok lekérése (Saját profil)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) return res.status(404).json({ error: "Felhasználó nem található" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// Profil adatainak frissítése (Név, Email, Jelszó, Cím)
exports.updateProfile = async (req, res) => {
  try {
    const { nev, email, jelszo, cim } = req.body;
    const userId = req.user.user_id;

    // 1. Alap adatok frissítése (Név, Email, Cím)
    let query = "UPDATE users SET nev = ?, email = ?, cim = ?";
    let params = [nev, email, cim];

    // 2. Ha jelszót is küldött, titkosítjuk és hozzáadjuk a lekérdezéshez
    if (jelszo && jelszo.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(jelszo, salt);
      query += ", password_hash = ?";
      params.push(hash);
    }

    query += " WHERE user_id = ?";
    params.push(userId);

    await db.query(query, params);
    
    res.json({ 
      success: true, 
      message: "Profil sikeresen frissítve",
      user: { nev, email } 
    });
  } catch (err) {
    console.error("Profil frissítési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a mentés során" });
  }
};

// Fiók törlése
exports.deleteMe = async (req, res) => {
  try {
    await User.deleteAccount(req.user.user_id);
    res.json({ message: "Fiók sikeresen törölve" });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};