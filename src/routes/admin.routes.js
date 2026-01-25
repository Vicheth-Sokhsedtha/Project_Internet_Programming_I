// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const { Order, User, Product, Promotion } = require("../models");



// ============ ORDERS ============
// In admin.routes.js orders GET route
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id', 'username', 'email'] // Only include needed fields
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
});
// POST create order
router.post("/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

// PUT update order
router.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    await order.update(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order", details: err.message });
  }
});

// DELETE order
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    await order.destroy();
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order", details: err.message });
  }
});

// ============ USERS ============
// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
});

// POST create user
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
});

// PUT update user
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
});

// ============ PRODUCTS ============
// GET all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
});

// POST create product
router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product", details: err.message });
  }
});

// PUT update product
router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
});

// DELETE product
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
});

// ============ PROMOTIONS ============
// GET all promotions
router.get("/promotions", async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch promotions", details: err.message });
  }
});

// POST create promotion
router.post("/promotions", async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ error: "Failed to create promotion", details: err.message });
  }
});

// PUT update promotion
router.put("/promotions/:id", async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) return res.status(404).json({ error: "Promotion not found" });
    await promotion.update(req.body);
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ error: "Failed to update promotion", details: err.message });
  }
});

// DELETE promotion
router.delete("/promotions/:id", async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) return res.status(404).json({ error: "Promotion not found" });
    await promotion.destroy();
    res.json({ message: "Promotion deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete promotion", details: err.message });
  }
});

module.exports = router;
