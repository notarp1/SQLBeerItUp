const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')



const BeverageType = db.define('BeverageType', {
    // Model attributes are defined here
    kId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    beverageName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    beverageType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pictureUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,


  });

  module.exports = BeverageType