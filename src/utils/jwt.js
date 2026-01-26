// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-super-secret-key-here-make-it-long-and-random',
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };