const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

const multer = require("multer");
const { Order } = require("../models"); // adjust path to your Sequelize models

// Configure multer (store files in /uploads, 10 MB limit)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
});

// -------------------- Product Routes --------------------
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);
router.get("/category/:category", controller.getProductsByCategory);
router.post("/", controller.createProduct);

// -------------------- Order Routes --------------------

// ✅ Create order with file uploads
router.post(
  "/orders/create",
  upload.fields([{ name: "receipt" }, { name: "locationImage" }]),
  async (req, res) => {
    try {
      console.log("Raw body:", req.body);
      console.log("Files:", req.files);

      const orderData = JSON.parse(req.body.orderData);
      console.log("Parsed orderData:", orderData);

      const newOrder = await Order.create({
        orderNumber: orderData.orderNumber, // ✅ must include
        userId: orderData.userId,
        productId: Number(orderData.productId), // ✅ ensure integer
        quantity: orderData.quantity,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        contactNumber: orderData.contactNumber,
        email: orderData.email,
        deliveryAddress: orderData.deliveryAddress,
        receiptPath: req.files.receipt?.[0]?.path || null,
        locationImagePath: req.files.locationImage?.[0]?.path || null,
        status: "Pending"
      });

      res.json({
        orderNumber: newOrder.orderNumber,
        message: "Order created successfully"
      });
    } catch (err) {
      console.error("Order error:", err);
      res.status(500).json({ error: "Failed to create order" });
    }
  }
);

// ✅ Get all orders
router.get("/orders/all", controller.getAllOrders);

// ✅ Update order payment
router.put("/orders/:orderId/payment", controller.updateOrderPayment);

// ✅ Get orders by user
router.get("/orders/user/:userId", controller.getOrdersByUser);

module.exports = router;
