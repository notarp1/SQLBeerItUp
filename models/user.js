const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')



const User = db.define('User', {
    // Model attributes are defined here
   
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    uName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uPin: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {

  // If don't want updatedAt
  updatedAt: false,
  });
  
module.exports = User