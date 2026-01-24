// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require('./src/config/db');
const seedData = require('./src/seeds/seedData');
const multer = require("multer"); // <-- add this line

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// Import models
const { User, Product, Order, Promotion } = require('./src/models');

// Import routes
const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/product.routes');
const adminRoutes = require('./src/routes/admin.routes');


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// Increase JSON body limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

// Associations

Order.belongsTo(Product, { foreignKey: "productId", as: "Product" });
Product.hasMany(Order, { foreignKey: "productId", as: "Orders" });
// Simple test route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: "User", attributes: ["username", "email"] }]
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" }); } });

// Connect DB and start server
sequelize.authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully");

    // Force sync to recreate tables with new relationships
    sequelize.sync({ force: true })
      .then(async () => {
        console.log("✅ Database tables synced");

        // Seed database with test data
        await seedData();

        app.listen(PORT, () => {
          console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
      })
      .catch((err) => {
        console.error("❌ Error syncing database:", err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error("❌ Error connecting to database:", err);
    process.exit(1);
  });
