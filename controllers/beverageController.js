const { json } = require("express/lib/response");
const res = require("express/lib/response");
const db = require("../config/database");
const Beverage = require("../models/Beverage");
const BeverageType = require("../models/BeverageType");
const sequelize = require("sequelize");
const  { Op } = require("sequelize");

async function getBeverageId(name, kId) {
  try {
    var type = await BeverageType.findOne({
      where: { beverageName: name, kId: kId },
    });
    return type.id;
  } catch (error) {
    handleError(error, res);
  }
}


exports.calculateMoneyUserIsOwed = async function (req, res) {
  try {
    var beverageOwnerId = req.params.id
    var kitchenId = req.params.kId
    var moneyOwed = await db.query(
      `SELECT t1.uName as name, 
      t1.uPhone as phone, 
      t1.id as uId, 
      SUM(price) as total  
      FROM Users t1 
      JOIN Beverages t2 ON t1.id = t2.beverageDrinkerId  
      WHERE beverageOwnerId = '${beverageOwnerId}'
      AND beverageDrinkerId != '${beverageOwnerId}'
      AND kitchenId = '${kitchenId}'
      AND removedAt is not NULL AND settleDate is NULL GROUP BY uName`,
      { type: sequelize.QueryTypes.SELECT }
    );
      res.status(200).json(moneyOwed)
      
      
  } catch (error) {
    handleError(error, res);
  }
};

exports.calculateMoneyUserOwes = async function (req, res) {
  try {
    var beverageDrinkerId = req.params.id
    var kitchenId = req.params.kId
    var moneyOwes = await db.query(
      `SELECT t1.uName as name, 
      t1.uPhone as phone, 
      t1.id as uId, 
      SUM(t2.price) as total 
      FROM Users t1  JOIN Beverages t2 ON t1.id = t2.beverageOwnerId 
      WHERE beverageDrinkerId = '${beverageDrinkerId}' 
      AND kitchenId = '${kitchenId}'
      AND removedAt is not NULL AND settleDate is NULL GROUP BY t1.uName`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
      res.status(200).json(moneyOwes)

  } catch (error) {
    handleError(error, res);
  }
};

exports.makePayment = async function (req, res){
  try {
    var userId = req.params.id
    var recipient = req.params.recipient
    var dateTime = new Date();
    console.log(recipient)
    var payments = await Beverage.findAll({
      where:{
        beverageDrinkerId: userId, 
        beverageOwnerId:recipient,
        removedAt: {[Op.not]: null},
        settleDate: {[Op.is]: null}
      },
      raw: true})
      
      

      payments.forEach(element => {
        element.settleDate = dateTime
      });

      await Beverage.bulkCreate(payments, {
        updateOnDuplicate: ["settleDate"],
      });

      res.status(200).json("true")

  } catch (error) {
    console.log(error)
    handleError(error, res);

  }
}



/* Run when calculating beverage price */
exports.calculateBeverageCostSequential = async function (req, res) {
  try {
    
    var bevCalcConfig = req.body
 
 
    var kId = req.params.id;
    var bevId = await getBeverageId(bevCalcConfig.bevName, kId);

    var selectedBeverageInStock = await Beverage.findAll({
      where: { beverageTypeId: bevId, kitchenId: kId, removedAt: {[Op.is]: null} },
      raw: true
    });


    var beveragesToSend = new Array();
    var price = 0;

    for (let index = 0; index < bevCalcConfig.count; index++) {
      price += selectedBeverageInStock[index].price;
      beveragesToSend.push(selectedBeverageInStock[index]);
    }


    res.status(200).json({ price: price, beverages: beveragesToSend });
  } catch (error) {
    handleError(error, res);
  }
};

/*When choosing a beverage and accepting it*/

exports.onBeverageTransactionAccept = async function (req, res) {
  try {
    var listOfObjectsToUpdate = req.body;
    var userId = req.params.uId;

    var dateTime = new Date();

  
    listOfObjectsToUpdate.forEach((element) => {
      element.removedAt = dateTime;
      element.beverageDrinkerId = userId;
      
      if(userId == element.beverageOwnerId){
        element.settleDate = dateTime   
      }
    })


    await Beverage.bulkCreate(listOfObjectsToUpdate, {
      updateOnDuplicate: ["removedAt", "beverageDrinkerId", "settleDate"],
    })
    res.status(200).send(true);
  } catch (error) {
    handleError(error, res);
  }
}

/*When choosing a beverage and accepting it*/
exports.onBeverageTransactionAcceptTest = async function (req, res) {
  
    try {
      var listOfObjectsToUpdate = req.body;
      var userId = req.params.uId;
  
      var dateTime = new Date();
  
    
      listOfObjectsToUpdate.forEach((element) => {
        element.removedAt = dateTime;
        element.beverageDrinkerId = userId;
        
        if(userId == element.beverageOwnerId){
          element.settleDate = dateTime   
        }
      })
  
  
      await Beverage.bulkCreate(listOfObjectsToUpdate, {
        updateOnDuplicate: ["removedAt", "beverageDrinkerId", "settleDate"],
      })
      res.status(200).send(true);
    } catch (error) {
      handleError(error, res);
      transactionLock = false
    }

}


exports.getBeverageTypes = async function (req, res) {
  try {
    var kId = req.params.id;
    var type = req.params.type
    var beverages = await BeverageType.findAll({ where: { kId: kId, BeverageType: type} });

    res.status(200).json(beverages);
  } catch (error) {
    handleError(error, res);
  }
};

exports.getBeveragesInStock = async function (req, res) {
  try {
    var kitchenId = req.params.id;
    var type = req.params.type

    if (kitchenId == "-1") {
      res.status(406).send("Kitchen not found, retrying");
      return;
    }

    var stock = await db.query(
      `SELECT beverageTypeId, t2.beverageName, t2.beverageType, t2.pictureUrl, COUNT(*) as stock FROM Beverages t1 JOIN BeverageTypes t2 ON t1.beverageTypeId = t2.id  WHERE kitchenId = '${kitchenId}' AND removedAt IS NULL AND t2.beverageType = '${type}' GROUP BY beverageTypeId`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json(stock);
  } catch (error) {
    handleError(error, res);
  }
};

exports.getBeverages = async function (req, res) {
  try {
    var kitchenId = req.params.id;

    if (kitchenId == "-1") {
      res.status(406).send("Kitchen not found, retrying");
      return;
    }

    console.log(kitchenId);

    var beverages = await Beverage.findAll({
      where: { kitchenId: kitchenId },
    });

    res.status(200).json(beverages);
  } catch (error) {
    handleError(error, res);
  }
};

exports.getSpecificBeverage = async function (req, res) {
  try {
    var kId = req.params.id;
    var selectedBeer = req.params.beverageId;

    var beerlist = await Beverage.findAll({
      where: { kitchenId: kId, beverageTypeId: selectedBeer,
        removedAt: {[Op.is]: null},
        settleDate: {[Op.is]: null}},
    });

    res.status(200).json(beerlist);
  } catch (error) {
    handleError(error, res);
  }
};

exports.addBeverages = async function (req, res) {
  try {
    var beerInfo = req.body;

    var iterations = beerInfo.quantity;

    //var beverageName = req.params.beverage;
    var kitchenId = req.params.id;

    if (kitchenId == "-1") {
      res.status(406).send("Kitchen not found, retrying");
      return;
    }

    //var beverageTypeId = await getBeverageId(beverageName, kitchenId);
    var price =  parseInt(beerInfo.price);
    var beverageOwnerId = beerInfo.uId;
    var dateTime = new Date();
  
    await Beverage.bulkCreate(
      Array.from({ length: iterations }).map(() => ({
        beverageTypeId: beerInfo.beverageTypeId,
        price: price,
        kitchenId: kitchenId,
        beverageOwnerId: beverageOwnerId,
        createdAt: dateTime
      }))
    );

    res.status(200).send(true);
  } catch (e) {
    handleError(e, res);
  }
};


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
};

