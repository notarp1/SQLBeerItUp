const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')

const Beverages = db.define('Beverage', {
    // Model attributes are defined here
    
    beverageTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kitchenId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    beverageOwnerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    createdAt: {
    type: DataTypes.DATE,
    allowNull: false
    },
    removedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    beverageDrinkerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    settleDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
   

  }, {

  // If don't want updatedAt
  timestamps: false
  });
  
module.exports = Beverages