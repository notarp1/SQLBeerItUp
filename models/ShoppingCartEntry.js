const { Sequelize, DataTypes } = require('sequelize');
const Int = require('tedious/lib/data-types/int');
const db = require('../config/database')

const ShoppingCartEntry = db.define('ShoppingCart', {
    // Model attributes are defined here
    
    kId: {
        type: Int,
        allowNull: false
    },
    itemdesc: {
      type: DataTypes.STRING,
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
    buyer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
   

  }, {

  updatedAt: false
  });
  
module.exports = ShoppingCartEntry