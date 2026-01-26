const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const sequelize = require("../config/db"); // ✅ import sequelize
const { authenticateUser } = require("../middleware/authMiddleware");
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
// orders.routes.js - Update POST route
// orders.routes.js - Update the POST route
router.post("/", authenticateUser, upload.fields([
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
      userId: req.user.id, // FIXED: Use req.user.id from authentication
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
      email: email || req.user.email, // Use user's email if not provided
      userLocation: storedLocation,
      deliveryAddress: storedLocation,
      storedLocation
    });

    res.status(201).json({ 
      message: "Order created successfully", 
      order 
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});
// orders.routes.js - Update user-history route
router.get("/user-history", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { 
          model: User, 
          attributes: ["id", "username", "email"] 
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

// Add a route to get receipt image
router.get("/:orderId/receipt", async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    
    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId // Ensure user can only access their own receipts
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (!order.paymentProof) {
      return res.status(404).json({ error: "Receipt not available" });
    }
    
    res.json({ 
      receiptUrl: `/uploads/${order.paymentProof}` 
    });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.status(500).json({ error: "Failed to fetch receipt" });
  }
});

// Add this route to your orders.routes.js file
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryAddress, contactNumber, email } = req.body;
    
    console.log(`Updating order ${id} with data:`, req.body);
    
    // Find the order
    const order = await Order.findOne({
      where: { id }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Check if user is admin or order owner
    const isAdmin = req.user.role === "admin";
    const isOwner = order.userId === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to update this order" });
    }
    
    // Update only provided fields
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (deliveryAddress !== undefined) updates.deliveryAddress = deliveryAddress;
    if (contactNumber !== undefined) updates.contactNumber = contactNumber;
    if (email !== undefined) updates.email = email;
    
    // Apply updates
    await order.update(updates);
    
    // Get the updated order with user info
    const updatedOrder = await Order.findOne({
      where: { id },
      include: [
        { 
          model: User, 
          attributes: ["id", "username", "email"] 
        }
      ]
    });
    
    console.log("Order updated successfully:", updatedOrder);
    
    res.json({ 
      message: "Order updated successfully", 
      order: updatedOrder 
    });
    
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// 5. Delete order (Admin only)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const order = await Order.findOne({ where: { id } });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    await order.destroy();
    
    res.json({ message: "Order deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});


// Cancel order route
router.put("/:id/cancel", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body || {};
    
    console.log(`Cancelling order ${id}`, { cancelReason, userId: req.user.id });

    // Find the order
    const order = await Order.findOne({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns this order
    if (order.userId !== req.user.id) {
      return res.status(403).json({ 
        error: "You can only cancel your own orders" 
      });
    }

    // Check if order can be cancelled (only Pending orders)
    if (order.status !== "Pending" && order.status !== "pending") {
      return res.status(400).json({ 
        error: `Cannot cancel order. Current status: ${order.status}. Only pending orders can be cancelled.`,
        currentStatus: order.status
      });
    }

    // Update order
    await order.update({
      status: "Cancelled",
      cancelReason: cancelReason || "Cancelled by user",
      cancelledAt: new Date()
    });

    // Get updated order
    const updatedOrder = await Order.findOne({
      where: { id },
      include: [
        { 
          model: User, 
          attributes: ["id", "username", "email"] 
        }
      ]
    });

    console.log("✅ Order cancelled successfully:", {
      orderId: id,
      newStatus: "Cancelled",
      userId: req.user.id
    });

    res.json({ 
      success: true,
      message: "Order cancelled successfully", 
      order: updatedOrder 
    });

  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({ 
      error: "Failed to cancel order",
      details: error.message 
    });
  }
});


module.exports = router;
