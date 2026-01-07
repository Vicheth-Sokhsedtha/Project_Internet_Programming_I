const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING
  },
  stock: {
    type: DataTypes.INTEGER
  }
});

module.exports = Product;
