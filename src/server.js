const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const seedData = require("./seeds/seedData");



// Import models before syncing
const { User, Product, Order, Promotion } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream

// Static folder for uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
=======
// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

>>>>>>> Stashed changes
// test route
app.get("/", (req, res) => {
  res.send("Women Clothes Backend is running");
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
