const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  'women_shop', // database name, no spaces
  'root', // MySQL username
  '1234', // MySQL password
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // optional: disables Sequelize logging
  },
)

module.exports = sequelize
