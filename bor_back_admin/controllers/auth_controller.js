const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Token generáló segédfüggvények
 */
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { 
    expiresIn: process.env.JWT_ACCESS_EXPIRES 
  });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRES 
  });
};

/**
 * REGISZTRÁCIÓ
 */
exports.register = async (req, res) => {
  try {
    const { nev, email, jelszo, cim } = req.body;
    
    if (!nev || !email || !jelszo) {
      return res.status(400).json({ error: "Minden adat kötelező" });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Ez az email már létezik" });
    }

    // Jelszó titkosítása
    const hashed = await bcrypt.hash(jelszo, 10);

    // Felhasználó létrehozása
    const user_id = await User.create({ 
      nev, 
      email, 
      password_hash: hashed, 
      cim 
    });

    // Tokenek generálása az új ID-val
    const accessToken = createAccessToken({ user_id, email });
    const refreshToken = createRefreshToken({ user_id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ accessToken, user: { user_id, nev, email, cim } });
  } catch (err) {
    console.error("Regisztrációs hiba:", err);
    res.status(500).json({ error: "Szerverhiba történt a regisztráció során" });
  }
};

/**
 * BEJELENTKEZÉS
 */
exports.login = async (req, res) => {
  try {
    const { email, jelszo } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !(await bcrypt.compare(jelszo, user.password_hash))) {
      return res.status(401).json({ error: "Hibás email vagy jelszó" });
    }

    const accessToken = createAccessToken({ user_id: user.user_id, email: user.email });
    const refreshToken = createRefreshToken({ user_id: user.user_id });

    res.cookie("refreshToken", refreshToken, { 
      httpOnly: true, 
      sameSite: "strict", 
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    res.json({ 
      accessToken, 
      user: { user_id: user.user_id, nev: user.nev, email: user.email, cim: user.cim } 
    });
  } catch (err) {
    console.error("Bejelentkezési hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

/**
 * TOKEN FRISSÍTÉS (REFRESH)
 */
exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "Nincs refresh token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(401).json({ error: "Felhasználó nem található" });
        }

        const accessToken = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES }
        );

        res.json({ accessToken });
    } catch (err) {
        console.error("JWT HIBA:", err.message);
        return res.status(403).json({ error: "Érvénytelen refresh token" });
    }
};

/**
 * KIJELENTKEZÉS
 */
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Sikeres kijelentkezés" });
};

/**
 * SAJÁT ADATOK LEKÉRÉSE (ME)
 */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) return res.status(404).json({ error: "Nincs ilyen felhasználó" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};