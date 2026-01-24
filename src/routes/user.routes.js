const express = require("express");
const bcrypt = require("bcrypt");   // or 'bcryptjs'
const User = require("../models/user");
const router = express.Router();

// Register user
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.json({ message: "User signed up successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
const { generateToken } = require("../utils/jwt");

router.post("/login", async (req, res) => {
  console.log("Received body:", req.body);

  const { email, username, password } = req.body;
  try { // Find by email OR username
    const user = await User.findOne({
      where: email ? { email } : { username }
    });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // ✅ Generate JWT with role
    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      message: user.role === "admin" ? "Admin login successful" : "Login successful",
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
