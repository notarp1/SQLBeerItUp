const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')



const User = db.define('User', {
    // Model attributes are defined here
   
    uName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uPass: {
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