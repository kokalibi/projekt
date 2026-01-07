const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ validáció
    if (!email || !password) {
      return res.status(400).json({ error: "Email és jelszó kötelező" });
    }

    // 2️⃣ admin lekérés
    const [rows] = await db.query(
      "SELECT id, email, jelszo, nev FROM adminok WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Hibás email vagy jelszó" });
    }

    const admin = rows[0];

    // 3️⃣ jelszó ellenőrzés
    const ok = await bcrypt.compare(password, admin.jelszo);
    if (!ok) {
      return res.status(401).json({ error: "Hibás email vagy jelszó" });
    }

    // 4️⃣ JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ COOKIE
    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // https esetén true
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      id: admin.id,
      email: admin.email,
      nev: admin.nev,
      token: token // <--- Ez fontos a localStorage-hoz
    });

  } catch (err) {
    console.error("ADMIN LOGIN HIBA:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};
