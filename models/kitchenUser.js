const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')


const KitchenUser = db.define('KitchenUsers', {
  kId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uId:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
updatedAt: false,
});


module.exports = KitchenUser