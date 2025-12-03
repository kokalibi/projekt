// middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nagyon_titkos_fallback";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Hiányzó vagy hibás token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { user_id, email }
    next();
  } catch (err) {
    console.error("JWT verify hiba:", err);
    return res.status(401).json({ error: "Érvénytelen vagy lejárt token" });
  }
};

// helper token generáláshoz
module.exports.createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
