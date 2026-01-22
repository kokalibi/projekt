const User = require("../models/user_model");
const db = require("../config/db");

// Saját adatok lekérése
// user_controller.js javítása
exports.getMe = async (req, res) => {
  try {
    // Használjuk a modell findById függvényét!
    const row = await User.findById(req.user.user_id); 
    if (!row) return res.status(404).json({ error: "Felhasználó nem található" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Hiba az adatok lekérésekor" });
  }
};

// Profil frissítése (Név és profilkép)
exports.updateProfile = async (req, res) => {
  try {
    const { nev } = req.body;
    const profilKep = req.file ? `/uploads/profil/${req.file.filename}` : null;

    await User.updateProfile(req.user.user_id, nev, profilKep);
    
    // Visszaküldjük az új adatokat a frontendnek
    res.json({ 
      success: true, 
      message: "Profil sikeresen frissítve",
      profil_kep: profilKep, // Ez kell a frontend frissítéséhez
      nev: nev
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// Fiók törlése
exports.deleteMe = async (req, res) => {
  try {
    await User.deleteAccount(req.user.user_id);
    res.json({ success: true, message: "Fiók törölve" });
  } catch (err) {
    res.status(500).json({ error: "Hiba a törlés során" });
  }
};