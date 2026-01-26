// Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

// In Order.js - update the model definition
const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderNumber: { type: DataTypes.STRING, unique: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" }
  },
  // Remove product-specific fields from here
  items: {
    type: DataTypes.JSON, // Store array of products as JSON
    defaultValue: []
  },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
  paymentMethod: { type: DataTypes.STRING, defaultValue: "QR Code" },
  paymentProof: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  contactNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  userLocation: { type: DataTypes.TEXT },
  deliveryAddress: { type: DataTypes.TEXT },
  storedLocation: { type: DataTypes.TEXT }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (order, options) => {
      const [rows] = await sequelize.query(
        'SELECT MAX(CAST(orderNumber AS UNSIGNED)) as maxNum FROM Orders WHERE orderNumber REGEXP "^[0-9]+$"',
        { transaction: options.transaction }
      );
      const maxNum = rows[0]?.maxNum || 0;
      order.orderNumber = (maxNum + 1).toString().padStart(3, "0");
    }
  }
});

// Keep associations but note that items are stored as JSON
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

module.exports = Order;
