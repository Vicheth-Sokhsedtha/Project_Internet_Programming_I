const { verifyToken } = require("./src/utils/jwt");

function adminOnly(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  req.user = decoded;
  next();
}

module.exports = adminOnly;
