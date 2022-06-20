const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database')


const KitchenAdmin = db.define('KitchenAdmins', {
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


module.exports = KitchenAdmin