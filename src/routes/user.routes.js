const express = require("express");
const bcrypt = require("bcryptjs");   // or 'bcryptjs'
const { Op } = require("sequelize");
const User = require("../models/user");
const { authenticateUser } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Register user
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Signup attempt:", { username, email }); // Add this for debugging
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.json({ message: "User signed up successfully", user: newUser });
  } catch (err) {
    console.error("Signup error:", err); // Add this
    res.status(500).json({ error: err.message });
  }
});

// Login user
const { generateToken } = require("../utils/jwt");

router.post("/login", async (req, res) => {
  console.log("Received body:", req.body);

  const { email, username, password } = req.body;
  try {
    // Build conditions for finding user by email or username
    const conditions = [];
    if (email) conditions.push({ email });
    if (username) conditions.push({ username });

    if (conditions.length === 0) {
      return res.status(400).json({ error: "Email or username is required" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: conditions
      }
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
  user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
      avatar: user.avatar,
    },
  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Don't send password back
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, address, city, postalCode, country } = req.body;

    // Find and update the user
    const [updatedRowsCount] = await User.update(
      {
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        country: country || null,
      },
      {
        where: { id: userId }
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Don't send password back
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Upload avatar
router.post("/avatar", authenticateUser, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

     console.log('Uploaded file:', req.file); // Add logging
    // Update user avatar path
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    console.log('Avatar path:', avatarPath); // Add logging
    const [updatedRowsCount] = await User.update(
      { avatar: avatarPath },
      { where: { id: userId } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    console.log('Updated user avatar:', updatedUser.avatar); // Add logging

    res.json({
      message: "Avatar uploaded successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

// Change password
router.put("/change-password", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

module.exports = router;
