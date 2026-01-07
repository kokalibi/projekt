const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Nincs token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "admin") {
      return res.status(403).json({ error: "Nem admin" });
    }

    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Érvénytelen token" });
  }
};
