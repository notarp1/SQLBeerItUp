const { json } = require("express/lib/response");
const res = require("express/lib/response");
const db = require("../config/database");
const sequelize = require("sequelize");
const ShoppingCart = require("../models/ShoppingCartEntry")



exports.addItemToCart = async function (req, res) {
  try{
    var entry = await ShoppingCart.create(req.body)
    
    res.status(201).json("true");
  
  }catch(e){
    console.log(e)
    handleDatabaseError(e, res);
  }
}

exports.updateCartItem = async function (req, res) {
  try{
    console.log("UPDATE CART")
    var entry = req.body
    var dateTime = new Date();


    entryToUpdate = await ShoppingCart.findOne({ where: { id: entry.id} })
    entryToUpdate.removedAt = dateTime
    entryToUpdate.price = entry.price
    entryToUpdate.buyer = entry.buyer

    entryToUpdate.save()


    res.status(201).json("true");
  
  }catch(e){
    console.log(e)
    handleDatabaseError(e, res);
  }
}

exports.getAllItems = async function (req, res) {
    try{      
      
      var items = await db.query(
        `SELECT 
        cart.id as id,
        cart.kId,
        cart.itemdesc as description,
        cart.createdAt as created,
        cart.removedAt as bought,
        cart.price,
        u.uPhone as phone,
        u.uName as buyer
        FROM ShoppingCarts cart LEFT JOIN Users u ON u.id = cart.buyer WHERE cart.kId = ${req.params.id} 
        ORDER BY cart.createdAt DESC`,
        { type: sequelize.QueryTypes.SELECT }
      );
      
      res.status(200).json(items);
    
    }catch(e){
      console.log(e)
      handleDatabaseError(e, res);
    }
  }
  

function sendErrorCode(e, res) {
    switch (e.name) {
        case "SequelizeUniqueConstraintError":
            res.status(409).send(e);
            break;
        case "SequelizeDatabaseError":
            res.status(409).send(e);
            break;
        default:
            res.status(400).send(e);
            break;
    }
}