const { json } = require("express/lib/response");
const res = require("express/lib/response");
const db = require("../config/database");
const Kitchens = require("../models/Kitchen");
const KitchenUser = require("../models/KitchenUser");
const stringHash = require("string-hash");
const BeverageType = require("../models/BeverageType");
const sequelize = require("sequelize");
const User = require("../models/User");
const ShoppingCart = require("../models/ShoppingCartEntry")




exports.createKitchen = async function (req, res) {
  try {
    
    
    var kitchen = await Kitchens.create(req.body)
    kitchen.name = kitchen.kName.trim()
    var beverages = assignBeveragesToKitchen(kitchen.id)
    await BeverageType.bulkCreate(beverages);

    res.status(201).json(kitchen);
  } catch (e) {
    handleDatabaseError(e, res);
  }
};

exports.isKitchenNameAvailable = async function (req, res){
  try {
      var kitchenList = await Kitchens.findAll({where: {kName: req.params.name}})
    
      if(kitchenList.length > 0) res.status(409).send("false");
      else res.status(200).send("true");;
  } catch (e) {
      console.log(e.code)
      res.status(400).send(e);
  }
}


exports.login = async function (req, res) {
  try {
    var kitchen = req.body;

    var pass = kitchen.kPass;
    var hashedPass = stringHash(pass);

    var kitchen = await Kitchens.findOne({ where: { kName: kitchen.kName } });

    if (kitchen.kPass == hashedPass) {
      res.status(200).json(kitchen);
      return;
    }
    res.status(401).send(false);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getKitchen = async function (req, res) {
  try {
    var kitchen = await Kitchens.findOne({ where: { id: req.params.id } });
    res.status(200).json(kitchen);
  } catch (e) {
    handleDatabaseError(e, res);
  }
};


exports.kitchenAuthentication = async function (req, res){

  try {
      var kitchenAuthObject = req.body
      var kitchen = await Kitchens.findOne({where: {kName: kitchenAuthObject.kName.trim()}})
      

      if(kitchen.kPin == kitchenAuthObject.kPin){
        res.status(200).json(kitchen);

      } else {
        res.status(401).send({message: "Wrong password"});
      }

  } catch (e) {
     handleDatabaseError(e, res);
  }
}

exports.giveUserAdminRights = async function (req, res) {
  try {
    var kitchenAdmin = req.body
    
    await KitchenUser.update({isAdmin: true}, {where: {uId: kitchenAdmin.uId}})
    res.status(200).send(true);
  } catch (e) {
    handleDatabaseError(e, res);
  }
};

exports.getAllKitchens = async function (req, res) {
  try {
    var kitchens = await Kitchens.findAll();
    res.status(200).json(kitchens);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

exports.postKitchenUser = async function (req, res) {
  try {
    console.log(req.body)

    var kitchenUser = req.body
    var user = await KitchenUser.findOne({where: {kId: kitchenUser.kId, uId: kitchenUser.uId}, type: sequelize.QueryTypes.SELECT })
    
    if(user == null){
      await KitchenUser.create(kitchenUser);
      res.status(201).send("true");
    } else {
    
      res.status(400).send(Error("User already exists"));
    }
   
  } catch (e) {
    handleDatabaseError(e, res);
  }
};



exports.getKitchenUser = async function (req, res) {
  try {
    var kitchen = await Kitchens.findOne({where: {id: req.params.id}})
 
    if(kitchen == null){
      res.status(404).send({message: "Kitchen Does Not Exist"})
      return
    }
    
    var users = await KitchenUser.findOne({where: {id: req.params.uId}})
    
    res.status(200).json(users);
  } catch (e) {
    handleDatabaseError(e, res);
  }
};



exports.getKitchenUsers = async function (req, res) {
  try {
    var kitchen = await Kitchens.findOne({where: {id: req.params.id}})
 
    if(kitchen == null){
      res.status(404).send({message: "Kitchen Does Not Exist"})
      return
    }
    
    var users = await db.query(
      `SELECT t2.id, t2.uName, t2.uPhone, t2.uPin from KitchenUsers t1 JOIN Users t2 ON t1.uId = t2.id WHERE t1.kId = ${req.params.id}`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    res.status(200).json(users);
  } catch (e) {
    handleDatabaseError(e, res);
  }
};




function handleDatabaseError(e, res) {
  switch (e.name) {
    case "SequelizeUniqueConstraintError":
      res.status(409).send({message: e.message});
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

function assignBeveragesToKitchen(id){
  return new Array(
    {
      kId: id,
      beverageName: "Carlsberg",
      beverageType: "beer",
      pictureUrl: "carlsberg.png",
    },
    {
      kId: id,
      beverageName: "Tuborg",
      beverageType: "beer",
      pictureUrl: "tuborg.png",
    },
    {
      kId: id,
      beverageName: "Tuborg Classic",
      beverageType: "beer",
      pictureUrl: "classic.png",
    },
    {
      kId: id,
      beverageName: "Royal Export",
      beverageType: "beer",
      pictureUrl: "rexport.png",
    },
    {
      kId: id,
      beverageName: "Royal Pilsner",
      beverageType: "beer",
      pictureUrl: "rpilsner.png",
    },
    {
      kId: id,
      beverageName: "Carls Special",
      beverageType: "beer",
      pictureUrl: "carlsspecial.png",
    },
    {
      kId: id,
      beverageName: "Tuborg Guld",
      beverageType: "beer",
      pictureUrl: "guld.png",
    },
    {
      kId: id,
      beverageName: "Heineken",
      beverageType: "beer",
      pictureUrl: "heineken.png",
    },
    {
      kId: id,
      beverageName: "Tuborg Julebryg",
      beverageType: "beer",
      pictureUrl: "julebryg.png",
    },
    {
      kId: id,
      beverageName: "Tuborg Rå",
      beverageType: "beer",
      pictureUrl: "raa.png",
    },
    {
      kId: id,
      beverageName: "Royal Classic",
      beverageType: "beer",
      pictureUrl: "rclassic.png",
    }
  );
}
