const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const sequelize = require("../config/db"); // ✅ import sequelize

const crypto = require('crypto');


// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Keep original extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Create new order
// In orders.routes.js POST route
router.post("/", upload.fields([
  { name: "receipt", maxCount: 1 },
  { name: "locationImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      storedLocation,
      contactNumber,
      email,
      items,
      total
    } = req.body;

    const receiptFile = req.files?.receipt?.[0];
    const locationFile = req.files?.locationImage?.[0];
    const parsedItems = JSON.parse(items);

    // Calculate total if not provided
    const calculatedTotal = parsedItems.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);

    // Create ONE order with multiple items
    const order = await Order.create({
      orderNumber: crypto.randomUUID(),
      userId: req.user?.id || 1, // Replace with actual user ID
      items: parsedItems.map(item => ({
        productId: item.id,
        productName: item.name,
        size: item.size,
        quantity: item.qty,
        price: item.price,
        image: item.image
      })),
      total: calculatedTotal,
      paymentProof: receiptFile?.filename || null,
      location: locationFile?.filename || null,
      contactNumber,
      email,
      userLocation: storedLocation,
      deliveryAddress: storedLocation,
      storedLocation
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});
// Fetch all orders with customer + product info
router.get("/user-history", async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: Product, as: "OrderedProduct", attributes: ["name", "size", "price"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});



module.exports = router;
