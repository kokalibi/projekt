const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/**
 * Nodemailer konfiguráció
 * A .env fájlban megadott adatokkal csatlakozik az SMTP szerverhez.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // 587-es port esetén false, 465 esetén true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    const hash = await bcrypt.hash(jelszo, 10);
    const user_id = await User.create({ nev, email, hash, cim });

    // --- VISSZAIGAZOLÓ EMAIL KÜLDÉSE ---
    const mailOptions = {
      from: `"DrágaBorok Webshop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Sikeres regisztráció - DrágaBorok",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h1 style="color: #800000; text-align: center;">Üdvözlünk nálunk, ${nev}!</h1>
          <p>Köszönjük, hogy regisztráltál a <strong>DrágaBorok</strong> webshopba.</p>
          <p>Fiókod sikeresen elkészült a következő email címmel: <strong>${email}</strong></p>
          <p>Mostantól böngészhetsz prémium boraink között és kényelmesen leadhatod rendeléseidet.</p>
          <br>
          <div style="text-align: center; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; color: #555;">Ez egy automatikus visszaigazolás, kérjük ne válaszolj rá.</p>
          </div>
          <p style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
            Üdvözlettel,<br>
            <strong>A DrágaBorok csapata</strong>
          </p>
        </div>
      `,
    };

    // Levélküldés aszinkron módon
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Nodemailer hiba:", error);
      } else {
        console.log("Regisztrációs email elküldve: " + info.response);
      }
    });

    const accessToken = createAccessToken({ user_id, email });
    const refreshToken = createRefreshToken({ user_id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // Fejlesztés alatt false, élesben true
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { user_id, nev, email, cim } });
  } catch (err) {
    console.error("Regisztrációs hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
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

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken, user: { user_id: user.user_id, nev: user.nev, email: user.email, cim: user.cim } });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

/**
 * TOKEN FRISSÍTÉS (REFRESH)
 */
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "Nincs refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.user_id);

    if (!user) return res.status(401).json({ error: "Felhasználó nem található" });

    const accessToken = createAccessToken({ user_id: user.user_id, email: user.email });
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: "Érvénytelen refresh token" });
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