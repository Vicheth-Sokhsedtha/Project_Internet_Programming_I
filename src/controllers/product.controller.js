const Product = require('../models/Product');
const Order = require('../models/Order');
const { User } = require('../models');
const QRCode = require('qrcode');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findAll({
      where: { category, isActive: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, oldPrice, size, color, stock, image } = req.body;
    const product = await Product.create({
      name,
      description,
      category,
      price,
      oldPrice,
      size,
      color,
      stock,
      image
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all orders with user and product details
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Product, as: 'product', attributes: ['id', 'name', 'price', 'image', 'category'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, total, paymentProof, paymentMethod, userLocation, deliveryAddress, qrCode, storedLocation, locationImage } = req.body;

    // Get product to store image
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Generate QR code from order data
    const qrData = {
      orderId: `ORD-${Date.now()}`,
      amount: total,
      timestamp: new Date().toISOString()
    };

    let generatedQRCode;
    try {
      generatedQRCode = await QRCode.toDataURL(JSON.stringify(qrData));
    } catch (qrError) {
      console.log('QR Code generation warning:', qrError.message);
      generatedQRCode = qrCode || null;
    }

    const order = await Order.create({
      userId,
      productId,
      quantity,
      total,
      paymentProof,
      paymentMethod,
      userLocation,
      deliveryAddress,
      qrCode: generatedQRCode,
      productImage: product.image,
      storedLocation,
      locationImage,
      status: 'Pending'
    });

    // Fetch order with related data
    const orderWithDetails = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'user', attributes: ['username', 'email', 'address', 'phone', 'city'] },
        { model: Product, as: 'product', attributes: ['name', 'price', 'image'] }
      ]
    });

    res.status(201).json(orderWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order with payment proof
exports.updateOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentProof, status } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.update({
      paymentProof,
      status: status || 'Completed'
    });

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'user', attributes: ['username', 'email', 'address', 'phone', 'city'] },
        { model: Product, as: 'product', attributes: ['name', 'price', 'image'] }
      ]
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['username', 'email', 'address', 'phone', 'city'] },
        { model: Product, as: 'product', attributes: ['id', 'name', 'price', 'image', 'category'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
