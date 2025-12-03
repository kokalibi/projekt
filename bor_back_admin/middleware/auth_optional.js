// middleware/auth_optional.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "nagyon_titkos_fallback";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null; // no token → vendég
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;         // { user_id, email }
  } catch (err) {
    req.user = null;            // hibás token → kezeljük vendégként
  }

  next();
};
