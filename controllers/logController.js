const { json } = require('express/lib/response');
const res = require('express/lib/response');
const db = require('../config/database');
const Kitchens = require('../models/kitchen');
const KitchenUsers = require('../models/kitchenUser')
const BeverageType = require('../models/beverageType');
const Beverages = require("../models/beverages");
const Users = require('../models/user');



exports.added = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT count(*) as count, t1.createdAt as added, t2.uName as name, sum(t1.price) as price, t5.beverageName as bevName ` +
        `FROM Beverages t1 ` +
        `JOIN Users t2 ON t1.beverageOwnerId = t2.id ` +
        `JOIN BeverageTypes t5 ON  t1.beverageTypeId = t5.id ` +
        `WHERE t2.id = ${userId} ` +
        `GROUP BY t1.createdAt` 
      
       
        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })

        res.status(200).json(list)
    } catch (error) {
        sendErrorCode(error, res);
    }
  
}
exports.consumed = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT count(*) as count, sum(t1.price) as price,t1.removedAt as removed, t2.uName as name,t3.uName as owner, t5.beverageName as bevName ` +
        `FROM Beverages t1 ` +
        `JOIN Users t2 ON t1.beverageDrinkerId = t2.id ` +
        `JOIN  Users t3 ON  t1.beverageOwnerId = t3.id ` +
        `JOIN BeverageTypes t5 ON  t1.beverageTypeId = t5.id ` +
        `WHERE  t2.id = ${userId} ` +
        `AND t1.removedAt is not NULL ` +
        `GROUP BY t1.removedAt`

        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })
        res.status(200).json(list)
    } catch (error) {
        sendErrorCode(error, res);

    }
  

   
}
exports.bought = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT count(*) as count, sum(Beverages.price) as price, Beverages.settleDate as settled, owner.uName as owner, buyer.uName as you, owner.uPhone as ownerPhone, t5.beverageName as bevName ` +
        `FROM Beverages Beverages ` +
        `JOIN Users buyer ON Beverages.beverageDrinkerId = buyer.id ` +
        `JOIN Users owner ON Beverages.beverageOwnerId = owner.id ` +
        `JOIN BeverageTypes t5 ON  Beverages.beverageTypeId = t5.id ` +
        `WHERE buyer.id = ${userId} AND settleDate is not NULL ` +
        `GROUP BY Beverages.settleDate `  

        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })
        res.status(200).json(list)
    } catch (error) {
        sendErrorCode(error, res);
    } 
}
exports.sold = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT count(*) as count, sum(Beverages.price) as price, Beverages.settleDate as settled, owner.uName as you, buyer.uName as buyer, buyer.uPhone as ownerPhone, t5.beverageName as bevName ` +
        `FROM Beverages Beverages ` +
        `JOIN Users owner ON Beverages.beverageOwnerId = owner.id ` +
        `JOIN Users buyer ON Beverages.beverageDrinkerId = buyer.id ` +
        `JOIN  BeverageTypes t5 ON  Beverages.beverageTypeId = t5.id ` +
        `WHERE owner.id = ${userId} AND settleDate is not NULL ` +
        `GROUP BY Beverages.settleDate `

        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })
        res.status(200).json(list)
    } catch (error) {
        sendErrorCode(error, res);
    } 
}

exports.calculateYearlyLeaderboard = async function (req, res){
 
    try {
      
      let kId = req.params.id
      let year = req.params.year 
      var list = await db.query(`SELECT t2.uName as name, COUNT(*) as count FROM Beverages t1 JOIN Users t2 ON t1.beverageDrinkerId = t2.id WHERE kitchenId = ${kId} and settleDate BETWEEN '${year}-1-01' AND '${year}-12-31' GROUP BY t2.uName ORDER BY count DESC`, { type: db.QueryTypes.SELECT })
  
      res.status(200).json(list)
  
    } catch (error) {
      sendErrorCode(error, res);
    }
    
  
  }
  
  exports.calculateMonthlyLeaderboard = async function (req, res){
   
    try {
      
      let kId = req.params.id
      let month = parseInt(req.params.month)
      let year = req.params.year
  
      var list = await db.query(`SELECT t2.uName as name, COUNT(*) as count FROM Beverages t1 JOIN Users t2 ON t1.beverageDrinkerId = t2.id WHERE kitchenId = ${kId} and settleDate BETWEEN '${year}-${month}-01' AND '${year}-${(month+1)}-01' GROUP BY t2.uName ORDER BY count DESC`, { type: db.QueryTypes.SELECT })
  
      
      res.status(200).json(list)
  
    } catch (error) {

      sendErrorCode(error, res);
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
        case "SequelizeValidationError":
            res.status(409).send(e);
            break;
        default:
            res.status(400).send(e);
    }
}