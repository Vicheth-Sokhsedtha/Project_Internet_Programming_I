const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Promotion = sequelize.define("Promotion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,   // promo codes must be unique
  },
  discount: {
    type: DataTypes.FLOAT, // percentage discount
    allowNull: false,
  },
  expiry: {
    type: DataTypes.DATEONLY, // expiry date
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Promotion;
