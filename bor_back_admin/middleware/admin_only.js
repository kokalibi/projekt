// middleware/admin_only.js
module.exports = (req, res, next) => {
  // auth_middleware mar lefutott, req.user letezik
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin jogosultsag szukseges" });
  }
  next();
};
