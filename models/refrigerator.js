const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')

const Refrigerator = db.define('Refrigerator', {
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
    settleDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    removedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }

  }, {

  // If don't want updatedAt
  timestamps: false
  });
  
module.exports = Refrigerator