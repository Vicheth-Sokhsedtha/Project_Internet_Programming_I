const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Order = require("../models/Order");
const sequelize = require("../config/db"); // ✅ import sequelize

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Create new order
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

    // ✅ Generate base orderNumber
    const [results] = await sequelize.query(
      'SELECT MAX(CAST(orderNumber AS UNSIGNED)) as maxNum FROM Orders WHERE orderNumber REGEXP "^[0-9]+$"',
      { raw: true }
    );
    const maxNum = results[0]?.maxNum || 0;

    // Create one order per item
    const createdOrders = await Promise.all(parsedItems.map((item, index) => {
      const orderNumber = (maxNum + index + 1).toString().padStart(3, "0");

      return Order.create({
        orderNumber, // ✅ required field
        userId: req.user?.id || 1, // Replace with actual user ID logic
        productId: item.id,
        quantity: item.qty,
        total: item.price * item.qty,
        paymentProof: receiptFile?.filename || null,
        location: locationFile?.filename || null,
        productImage: item.image,
        contactNumber,
        email,
        userLocation: storedLocation,
        deliveryAddress: storedLocation,
        storedLocation
      });
    }));

    res.status(201).json({ message: "Orders created successfully", orders: createdOrders });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
