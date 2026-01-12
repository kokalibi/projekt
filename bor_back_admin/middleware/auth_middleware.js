const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Nincs token" });

  const token = authHeader.split(" ")[1];
  try {
    // Kipróbáljuk mindkét kulcsot, amit a .env-ben megadtál
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Érvénytelen token" });
  }
};