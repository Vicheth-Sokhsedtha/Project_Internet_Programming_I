const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
