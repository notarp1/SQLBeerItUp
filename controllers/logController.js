const { json } = require('express/lib/response');
const res = require('express/lib/response');
const db = require('../config/database');





exports.checkInternetConnection = async function (req, res){
    res.status(200).send("I'm up and running")
}

exports.added = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT count(*) as count,
        sum(t1.price) as price,
        t5.beverageName as bevName,
        t1.createdAt as added ` +
        `FROM Beverages t1 ` +
        `JOIN BeverageTypes t5 ON  t1.beverageTypeId = t5.id ` +
        `WHERE t1.beverageOwnerId = '${userId}' ` +
        `GROUP BY t1.createdAt ` +
        `ORDER BY t1.createdAt DESC `
      
       
        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })

        res.status(200).json(list)
    } catch (error) {
        handleError(error, res);
    }
  
}
exports.consumed = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT count(*) as count,
        bevTypes.beverageName as bevName, 
        sum(bevs.price) as price, 
        owner.uName as counterPart,
        owner.uPhone as ownerPhone,
        bevs.removedAt as removed ` +
        `FROM Beverages bevs ` +
        `JOIN Users owner ON  bevs.beverageOwnerId = owner.id ` +
        `JOIN BeverageTypes bevTypes ON  bevs.beverageTypeId = bevTypes.id ` +
        
        `WHERE bevs.BeverageDrinkerId = '${userId}' AND bevs.removedAt is not NULL ` +
        `GROUP BY bevs.removedAt ` +
        `ORDER BY bevs.removedAt DESC `+ 
        `LIMIT 15 ` 

        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })
        res.status(200).json(list)
    } catch (error) {
        handleError(error, res);

    }
  

   
}
exports.bought = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT sum(Beverages.price) as price, 
        owner.uName as counterPart, 
        owner.uPhone as ownerPhone,
        Beverages.settleDate as settled ` +
        `FROM Beverages Beverages ` +
        `JOIN Users owner ON Beverages.beverageOwnerId = owner.id ` +
        `JOIN BeverageTypes t5 ON  Beverages.beverageTypeId = t5.id ` +
        `WHERE Beverages.beverageDrinkerId = '${userId}' AND Beverages.beverageOwnerId != '${userId}' AND settleDate is not NULL ` +
        `GROUP BY Beverages.settleDate ` +
        `ORDER BY Beverages.settleDate DESC `

        

        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })
        res.status(200).json(list)
    } catch (error) {
        handleError(error, res);
    } 
}
exports.sold = async function (req, res){
    try {
        let userId = req.params.id 
        let queryString = 
        `SELECT  
        sum(bevs.price) as price, 
        buyer.uName as counterPart, 
        buyer.uPhone as ownerPhone,
        bevs.settleDate as settled ` +
        `FROM Beverages bevs ` +
        `JOIN Users buyer ON bevs.beverageDrinkerId = buyer.id ` +
        `JOIN  BeverageTypes bevTypes ON  bevs.beverageTypeId = bevTypes.id ` +
        `WHERE bevs.beverageOwnerId = '${userId}' AND bevs.beverageDrinkerId != '${userId}' AND settleDate is not NULL ` +
        `GROUP BY bevs.settleDate ` +
        `ORDER BY bevs.settleDate DESC`

        var list = await db.query(queryString, { type: db.QueryTypes.SELECT })
        res.status(200).json(list)
    } catch (error) {
        handleError(error, res);
    } 
}

exports.calculateYearlyLeaderboard = async function (req, res){
 
    try {
      
      let kId = req.params.id
      let year = parseInt(req.params.year)
      let nextYear = year +1

      var list = await db.query(`
      SELECT t2.uName as name, 
      COUNT(*) as count 
      FROM Beverages t1 JOIN Users t2 ON t1.beverageDrinkerId = t2.id 
      WHERE kitchenId = '${kId}'
      and (removedAt  >= '${year}-01-01' AND  removedAt  < '${nextYear}-01-01')
	  GROUP BY t2.id 
      ORDER BY count DESC`, { type: db.QueryTypes.SELECT })

     
  
      await list.forEach((item, i) => {
        item.id = i + 1;
      });
  
      
      res.status(200).json(list)
  
    } catch (error) {
      handleError(error, res);
    }
    
  
  }
  
  exports.calculateMonthlyLeaderboard = async function (req, res){
   
    try {
      
      let kId = req.params.id
      let month = parseInt(req.params.month)
      let year = parseInt(req.params.year)
      let nextMonth = month + 1
      let  nextYear  = year

      if(nextMonth == 13){
        nextMonth = 1
        nextYear = year + 1
      }

      var list = await db.query(`
      SELECT t2.uName as name, 
      COUNT(*) as count 
      FROM Beverages t1 JOIN Users t2 ON t1.beverageDrinkerId = t2.id 
      WHERE kitchenId = '${kId}'
      and (removedAt  >= '${year}-${month}-01' AND  removedAt  < '${nextYear}-${nextMonth}-01')
	  GROUP BY t2.id 
      ORDER BY count DESC`, { type: db.QueryTypes.SELECT })

      await list.forEach((item, i) => {
        item.id = i + 1;
      });
  
      
      res.status(200).json(list)
  
    } catch (error) {
      handleError(error, res);
    }
    
  
  }




  function handleError(e, res) {
    switch (e.name) {
        case "SequelizeUniqueConstraintError":
            res.status(409).send(e);
            break;
        case "SequelizeDatabaseError":
            res.status(500).send(e);
            break;
        case "SequelizeValidationError":
            res.status(500).send(e);
            break;
        default:
            res.status(500).send(e);
            break;
    }
}
