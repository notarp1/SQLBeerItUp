const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')

const DeviceToken = db.define('DeviceToken', {
    // Model attributes are defined here
    
    uId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    deviceToken: {
        type: DataTypes.STRING(100),
        allowNull: false
    }

  }, {

  // If don't want updatedAt
  createdAt: false,
  updatedAt: true
  });
  
module.exports = DeviceToken