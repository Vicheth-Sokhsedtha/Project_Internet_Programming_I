// admin.routes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Apply authentication and admin authorization to all admin routes
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};
// Get all orders with user info
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { 
          model: User, 
          attributes: ['id', 'username', 'email', 'phone'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.use(authenticateUser);
router.use(authorizeAdmin);

module.exports = router;