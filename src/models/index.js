const User = require('./user');
const Product = require('./Product');
const Order = require('./Order');
const Promotion = require('./Promotion');

// Define Associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });

module.exports = {
  User,
  Product,
  Order,
  Promotion
};
