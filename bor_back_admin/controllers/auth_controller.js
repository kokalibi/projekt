const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });
const createRefreshToken = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES });

exports.register = async (req, res) => {
  try {
    const { nev, email, jelszo, cim } = req.body;
    if (!nev || !email || !jelszo) return res.status(400).json({ error: "Minden adat kötelező" });

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ error: "Ez az email már létezik" });

    const hash = await bcrypt.hash(jelszo, 10);
    const user_id = await User.create({ nev, email, hash, cim });

    const accessToken = createAccessToken({ user_id, email });
    const refreshToken = createRefreshToken({ user_id });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken, user: { user_id, nev, email, cim } });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, jelszo } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(jelszo, user.password_hash))) {
      return res.status(400).json({ error: "Hibás email vagy jelszó" });
    }

    const accessToken = createAccessToken({ user_id: user.user_id, email: user.email });
    const refreshToken = createRefreshToken({ user_id: user.user_id });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken, user: { user_id: user.user_id, nev: user.nev, email: user.email, cim: user.cim } });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) return res.status(404).json({ error: "User nem található" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "Nincs refresh token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    res.json({ accessToken: createAccessToken({ user_id: decoded.user_id }) });
  } catch (err) {
    res.status(401).json({ error: "Refresh token lejárt" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Kijelentkezve" });
};