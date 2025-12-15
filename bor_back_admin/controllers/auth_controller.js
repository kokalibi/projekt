// controllers/auth_controller.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =======================
   TOKEN HELPEREK
======================= */
const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES
  });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES
  });

/* =======================
   REGISZTRÁCIÓ
======================= */
exports.register = async (req, res) => {
  try {
    const { nev, email, jelszo, cim } = req.body;

    if (!nev || !email || !jelszo)
      return res.status(400).json({ error: "Nev, email es jelszo kotelezo" });

    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ error: "Ez az email mar letezik" });

    const hash = await bcrypt.hash(jelszo, 10);

    const [result] = await db.query(
      "INSERT INTO users (nev, email, password_hash, cim) VALUES (?,?,?,?)",
      [nev, email, hash, cim || null]
    );

    const user_id = result.insertId;

    const accessToken = createAccessToken({ user_id, email });
    const refreshToken = createRefreshToken({ user_id });

    // 🍪 refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // prod: true
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      user: { user_id, nev, email, cim }
    });
  } catch (err) {
    console.error("reg error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

/* =======================
   LOGIN
======================= */
exports.login = async (req, res) => {
  try {
    const { email, jelszo } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "Hibas email vagy jelszo" });

    const user = rows[0];

    const ok = await bcrypt.compare(jelszo, user.password_hash);
    if (!ok)
      return res.status(400).json({ error: "Hibas email vagy jelszo" });

    const accessToken = createAccessToken({
      user_id: user.user_id,
      email: user.email
    });

    const refreshToken = createRefreshToken({
      user_id: user.user_id
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      user: {
        user_id: user.user_id,
        nev: user.nev,
        email: user.email,
        cim: user.cim
      }
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

/* =======================
   REFRESH TOKEN
======================= */
exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ error: "Nincs refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = createAccessToken({
      user_id: decoded.user_id
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: "Refresh token lejart" });
  }
};

/* =======================
   LOGOUT
======================= */
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Kijelentkezve" });
};

/* =======================
   JELENLEGI USER
======================= */
exports.me = async (req, res) => {
  try {
    const { user_id } = req.user;

    const [rows] = await db.query(
      "SELECT user_id, nev, email, cim, created_at FROM users WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User nem talalhato" });

    res.set("Cache-Control", "no-store");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
