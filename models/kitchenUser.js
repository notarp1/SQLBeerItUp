const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')


const KitchenUser = db.define('KitchenUsers', {
  kId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  uId:{
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
  }

},{
updatedAt: false,
});


module.exports = KitchenUser