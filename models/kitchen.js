const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')


const Kitchen = db.define('Kitchen', {
    // Model attributes are defined here
    kName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kPin: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    // don't add the timestamp attributes (updatedAt, createdAt)
  //timestamps: false,

  // If don't want createdAt
  //createdAt: false,

  // If don't want updatedAt
  updatedAt: false,
  });
  
module.exports = Kitchen