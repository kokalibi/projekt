// controllers/auth_controller.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwtMiddleware = require("../middleware/auth_middleware");


// token helper
const createToken =
  jwtMiddleware.createToken ||
  ((payload) => {
    const jwt = require("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  });

// REGISZTRÁCIÓ
exports.register = async (req, res) => {
  try {
    const { nev, email, jelszo, cim } = req.body;

    if (!nev || !email || !jelszo)
      return res.status(400).json({ error: "Név, email és jelszó kötelező" });

    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ error: "Ez az email már létezik" });

    const hash = await bcrypt.hash(jelszo, 10);

    const [result] = await db.query(
      "INSERT INTO users (nev, email, password_hash, cim) VALUES (?,?,?,?)",
      [nev, email, hash, cim || null]
    );

    const user_id = result.insertId;

    const token = createToken({ user_id, email });

    res.json({
      message: "Sikeres regisztráció",
      token,
      user: { user_id, nev, email, cim }
    });
  } catch (err) {
    console.error("reg error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, jelszo } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(400).json({ error: "Hibás email vagy jelszó" });

    const user = rows[0];

    const ok = await bcrypt.compare(jelszo, user.password_hash);
    if (!ok)
      return res.status(400).json({ error: "Hibás email vagy jelszó" });

    const token = createToken({
      user_id: user.user_id,
      email: user.email
    });

    res.json({
      message: "Sikeres bejelentkezés",
      token,
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

// JELENLEGI USER
exports.me = async (req, res) => {
  try {
    const { user_id } = req.user;

    const [rows] = await db.query(
      "SELECT user_id, nev, email, cim, created_at FROM users WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User nem található" });

    // 🔥 FONTOS FIX
    res.set("Cache-Control", "no-store");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

