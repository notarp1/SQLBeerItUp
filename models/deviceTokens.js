const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')

const DeviceToken = db.define('DeviceToken', {
    // Model attributes are defined here
    
    uId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {

  // If don't want updatedAt
  createdAt: false
  });
  
module.exports = DeviceToken