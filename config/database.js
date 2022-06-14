const Sequelize = require('sequelize')

//var config = require("../config/config.json")
// module.exports = new Sequelize('beeritup', 'notarp1', 'FrancescoFly2005', {
//     host: 'beeritup.database.windows.net',
//     dialect: 'mssql'
//   });



// module.exports = new Sequelize(config.username, config.username, config.password, {
//   host: 'beeritup.cluster-c7qylzzsgduz.eu-central-1.rds.amazonaws.com',
//   port: 3306,
//   dialect: 'mysql'

// });

module.exports = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.URL1,
  port: process.env.PORT,
  logging: console.log,
  dialect: 'mysql',
  dialectOptions: {
      ssl:'Amazon RDS'
  },
  language: 'en'
});


// module.exports = new Sequelize(config.database, config.username, config.password, {
//   host: config.url1,
//   port: 3306,
//   logging: console.log,
//   dialect: 'mysql',
//   dialectOptions: {
//       ssl:'Amazon RDS'
//   },
//   language: 'en'
// });