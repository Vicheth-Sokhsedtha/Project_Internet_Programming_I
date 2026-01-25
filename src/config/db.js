const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  'women_shop', // database name, no spaces
  'root', // MySQL username
  'stq34@AB', // MySQL password
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // optional: disables Sequelize logging
  },
)

module.exports = sequelize
