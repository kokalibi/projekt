const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email és jelszó kötelező" });

    const admin = await User.findAdminByEmail(email);
    if (!admin || !(await bcrypt.compare(password, admin.jelszo))) {
      return res.status(401).json({ error: "Hibás email vagy jelszó" });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("admin_token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ id: admin.id, email: admin.email, nev: admin.nev, token });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};