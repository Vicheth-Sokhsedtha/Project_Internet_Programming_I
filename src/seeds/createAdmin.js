const bcrypt = require("bcrypt");
const User = require("../models/user"); // adjust path if needed

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: "admin@gmail.com" } });
    if (existingAdmin) {
      console.log("Admin account already exists");
      return;
    }

    // Create new admin
    await User.bulkCreate({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully");
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}

module.exports = createAdmin;

