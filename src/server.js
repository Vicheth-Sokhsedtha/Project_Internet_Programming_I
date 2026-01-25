const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const seedData = require("./seeds/seedData");
const path = require('path');
const app = express();


// Import models before syncing
const { User, Product, Order, Promotion } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static folder for uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// test route
app.get("/", (req, res) => {
  res.send("Women Clothes Backend is running");
});

// Add to your app.js or create a test route
app.get('/test-uploads', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const uploadDir = path.join(__dirname, 'uploads');
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.json({ error: 'Uploads directory not found', files: [] });
    }
    
    res.json({ 
      uploadsPath: uploadDir,
      fileCount: files.length,
      files: files.slice(0, 10) // Show first 10 files
    });
  });
});

// routes
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/users", require("./routes/user.routes"));

sequelize.authenticate()
  .then(() => {
    console.log("MySQL connected");
    sequelize.sync({ alter: true })
      .then(async () => {
        console.log("Tables synced");
        // Seed database with test data
        await seedData();
      })
      .catch(err => console.log("Sync error:", err));

    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.log("Connection error:", err));
