const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true
    // removed allowNull: false so the hook can populate it
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Products", key: "id" }
  },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
  paymentMethod: { type: DataTypes.STRING, defaultValue: "QR Code" },
  paymentProof: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  productImage: { type: DataTypes.STRING },
  contactNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  userLocation: { type: DataTypes.TEXT },
  deliveryAddress: { type: DataTypes.TEXT },
  storedLocation: { type: DataTypes.TEXT }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (order, options) => {
      const transaction = options.transaction; // use transaction if available
      const [rows] = await sequelize.query(
        'SELECT MAX(CAST(orderNumber AS UNSIGNED)) as maxNum FROM Orders WHERE orderNumber REGEXP "^[0-9]+$"',
        { transaction }
      );
      const maxNum = rows[0]?.maxNum || 0;
      order.orderNumber = (maxNum + 1).toString().padStart(3, "0");
    }
  }

});

module.exports = Order;
