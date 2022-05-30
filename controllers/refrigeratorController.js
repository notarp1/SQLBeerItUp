const { json } = require("express/lib/response");
const res = require("express/lib/response");
const db = require("../config/database");

const Refrigerator = require("../models/refrigerator");
const BeverageType = require("../models/beverageType");

const sql = require("mssql");
const DateTime = require("tedious/lib/data-types/datetime");
const KitchenUser = require("../models/kitchenUser");
const sequelize = require("sequelize");
const { listen } = require("express/lib/application");

exports.getBeverageTypes = async function (req, res) {
  try {
    var kId = req.params.id
    var beverages = await BeverageType.findAll({where: {kId: kId}});
    
    res.status(200).json(beverages);
  } catch (error) {
    sendErrorCode(error, res);
  }
};

async function getBeverageId(name, kId) {
  try {
    var type = await BeverageType.findOne({ where: { beverageName: name, kId: kId} });
    return type.id;
  } catch (error) {}
}

exports.getBeveragesInStock = async function (req, res) {
  try {
    var kitchenId = req.params.id;

    if (kitchenId == -1) {
      res.status(406).send("Kitchen not found, retrying");
      return;
    }

    var stock = await db.query(
      `SELECT beverageTypeId, t2.beverageName, t2.beverageType, t2.pictureUrl, COUNT(*) as stock FROM Refrigerators t1 JOIN BeverageTypes t2 ON t1.beverageTypeId = t2.id  WHERE kitchenId = ${kitchenId} AND removedAt IS NULL GROUP BY beverageTypeId`,
      { type: sequelize.QueryTypes.SELECT }
    );
    

    res.status(200).json(stock);
  } catch (error) {
    sendErrorCode(error, res);
  }
};

exports.getBeverages = async function (req, res) {
  try {
    var kitchenId = req.params.id;

    if (kitchenId == -1) {
      res.status(406).send("Kitchen not found, retrying");
      return;
    }

    console.log(kitchenId);

    var beverages = await Refrigerator.findAll({
      where: { kitchenId: kitchenId },
    });

    res.status(200).json(beverages);
  } catch (error) {
    sendErrorCode(error, res);
  }
};

exports.getSpecificBeverage = async function (req, res){
  try {
    var kId = req.params.id
    var selectedBeer = req.params.beverageId
  
    var beerlist = await Refrigerator.findAll({where: {kitchenId: kId, beverageTypeId: selectedBeer}})


    res.status(200).json(beerlist);

  } catch (error) {
    sendErrorCode(error, res);
  }
}

exports.addBeverages = async function (req, res) {
  try {
    var beerInfo = req.body;

    var iterations = beerInfo.quantity;

    var beverageName = req.params.beverage;
    var kitchenId = req.params.id;

    if (kitchenId == -1) {
      res.status(406).send("Kitchen not found, retrying");
      return;
    }

    var beverageTypeId = await getBeverageId(beverageName, kitchenId);
    var price = beerInfo.price;
    var beverageOwnerId = beerInfo.uId;
    var dateTime = new Date();

    var datee =
      dateTime.getFullYear() +
      "/" +
      (dateTime.getMonth() + 1) +
      "/" +
      dateTime.getDate();
    console.log(dateTime)
   
    await Refrigerator.bulkCreate(
      Array.from({ length: iterations }).map(() => ({
        beverageTypeId: beverageTypeId,
        price: price,
        kitchenId: kitchenId,
        beverageOwnerId: beverageOwnerId,
        createdAt: dateTime,
      }))
    );

    res.status(200).send(true);
  } catch (e) {
    sendErrorCode(e, res);
  }
};

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
