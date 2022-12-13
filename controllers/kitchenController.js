const { json } = require("express/lib/response");
const res = require("express/lib/response");
const db = require("../config/database");
const Kitchens = require("../models/Kitchen");
const KitchenUser = require("../models/KitchenUser");
const stringHash = require("string-hash");
const BeverageType = require("../models/BeverageType");
const sequelize = require("sequelize");
const User = require("../models/User");
const ShoppingCart = require("../models/ShoppingCartEntry");
const { message } = require("prompt");




exports.isAdmin = async function (req, res){
  try {
    
    let kId = req.params.id
    let userId = req.params.uId
    let user = await KitchenUser.findAll({where: { kId: kId, isAdmin: 1, uId: userId }})

    if(user.length > 0) {
      res.status(200).json(1)
    } else {
      res.status(200).json(0)
    }
      


  } catch (e) {
    handleError(e, res);
  }
}

exports.isTheOnlyAdminSpecific = async function (req, res){
  try {
    
    let kId = req.params.id

    let users = await KitchenUser.findAll({where: { kId: kId, isAdmin: 1}})

    if(users.length > 1) {
      res.status(200).json(0)
    } else {
      res.status(200).json(0)
    }
    


  } catch (e) {
    handleError(e, res);
  }
}
exports.createKitchen = async function (req, res) {
  try {

    let kitchenToCreate = req.body
    
    kitchenToCreate.id = Date.now() + "c"


    if(kitchenToCreate.kPin.length != 4){
      res.status(401).send({message: "Something went wrong"});
      return
    }
  
    let kitchen = await Kitchens.create(kitchenToCreate)
    
    let beverages = assignBeveragesToKitchen(kitchen.id)
    await BeverageType.bulkCreate(beverages);

    res.status(201).send(kitchen);
  } catch (e) {
    console.log(e)
    handleError(e, res);
  }
};


exports.deleteKitchen = async function (req, res) {
  try {

    let id = req.params.id

    await Kitchens.destroy({where: {id: id}})


  
    res.status(201).send("deleted");
  } catch (e) {
    console.log(e)
    handleError(e, res);
  }
};

exports.addBeverageType = async function (req, res) {
  try {
    
    let bevType = req.body
  
    await BeverageType.create(bevType);

    res.status(201).send("Beverage Type Created!");
  } catch (e) {
    handleError(e, res);
  }
};


exports.isKitchenNameAvailable = async function (req, res){
  try {
    
      let kitchenList = await Kitchens.findAll({where: {kName: req.params.name}})
    
      if(kitchenList.length > 0) res.status(409).send("false");
      else res.status(200).send("true");;
   
  } catch (e) {
      console.log(e)
      res.status(400).send(e);
  }
}


exports.login = async function (req, res) {
  try {
    let body = req.body;

    let pass = body.kPass;
    let hashedPass = stringHash(pass);

    let kitchen = await Kitchens.findOne({ where: { kName: kitchen.kName } });

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
    let kitchen = await Kitchens.findOne({ where: { id: req.params.id } });
    res.status(200).json(kitchen);
  } catch (e) {
    handleError(e, res);
  }
};


exports.kitchenAuthentication = async function (req, res){

  try {
      let kitchenAuthObject = req.body
      let kitchen = await Kitchens.findOne({where: {kName: kitchenAuthObject.kName.trim()}})
      

      if(kitchen.kPin == kitchenAuthObject.kPin){
        res.status(200).json(kitchen);

      } else {
        res.status(401).send({message: "Wrong password"});
      }

  } catch (e) {
     handleError(e, res);
  }
}



exports.deleteKitchenUser = async function (req, res) {
  try {
    let id = req.params.id
    let userId = req.params.uId

    console.log("HAWD")


    let moneyOwedList = await db.query(
      `SELECT t1.uName as name, 
      t1.uPhone as phone, 
      t1.id as uId, 
      SUM(price) as total  
      FROM Users t1 
      JOIN Beverages t2 ON t1.id = t2.beverageDrinkerId  
      WHERE beverageOwnerId = '${userId}'
      AND beverageDrinkerId != '${userId}'
      AND removedAt is not NULL AND settleDate is NULL GROUP BY uName`,
      { type: sequelize.QueryTypes.SELECT }
    );

    let moneyOwesList = await db.query(
      `SELECT t1.uName as name, t1.uPhone as phone, t1.id as uId, SUM(t2.price) as total FROM Users t1  JOIN Beverages t2 ON t1.id = t2.beverageOwnerId WHERE beverageDrinkerId = '${userId}' AND removedAt is not NULL AND settleDate is NULL GROUP BY t1.uName`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if(moneyOwedList.length > 0 || moneyOwesList.length > 0){
      res.status(409).send({message: "The user has unsettled transactions and cannot be removed!"});
      return
    }
    await KitchenUser.destroy({where: {kId: id, uId: userId}})
    res.status(200).send("true");
  } catch (e) {
    handleError(e, res);
  }
};

exports.giveUserAdminRights = async function (req, res) {
  try {
    let kitchenAdmin = req.body

    if(kitchenAdmin.value == false){

      let list = await KitchenUser.findAll({where: {kId: kitchenAdmin.kId, isAdmin: true}})
    
      if(list.length == 1){
        res.status(409).send({message: "At least one person must be admin"});
        return
      }
    }
    
    await KitchenUser.update({isAdmin: kitchenAdmin.value}, {where: {uId: kitchenAdmin.uId}})
    res.status(200).send("true");
  } catch (e) {
    handleError(e, res);
  }
};

exports.getAllKitchens = async function (req, res) {
  try {
    let kitchens = await Kitchens.findAll();
    res.status(200).json(kitchens);
  } catch (error) {
    handleError(error, res);
  }
};

exports.postKitchenUser = async function (req, res) {
  try {
    console.log(req.body)

    let kitchenUser = req.body
    let user = await KitchenUser.findOne({where: {kId: kitchenUser.kId, uId: kitchenUser.uId}, type: sequelize.QueryTypes.SELECT })
    
    if(user == null){
      let obj = await KitchenUser.create(kitchenUser);
      res.status(201).send(obj);
    } else {
    
      res.status(400).send(Error("User already exists"));
    }
   
  } catch (e) {
    handleError(e, res);
  }
};



exports.getKitchenUser = async function (req, res) {
  try {
    
  
    let queryString = 
    `SELECT 
    kitchenUser.uId as id, 
    u.uName as uName,
    u.uPhone as phone,
    kitchenUser.isAdmin
    FROM KitchenUsers kitchenUser 
    JOIN Users u 
    ON u.id = kitchenUser.uId 
    WHERE kitchenUser.kId = '${req.params.id}' AND kitchenUser.uId = '${req.params.uId}' `
    
   
    let user = await db.query(queryString, { type: db.QueryTypes.SELECT })
    if(user == null){
      res.status(404).send({message: "Wrong password"});
      return
    }
    res.status(200).send(user[0]);
  } catch (e) {
    console.log(e)
    handleError(e, res);
  }
};



exports.getKitchenUsers = async function (req, res) {
  try {
    let id = req.params.id

    let queryString = 
        `SELECT 
        kitchenUser.uId as id, 
        u.uName as uName,
        u.uPhone as phone,
        kitchenUser.isAdmin
        FROM KitchenUsers kitchenUser 
        JOIN Users u 
        ON u.id = kitchenUser.uId 
        WHERE kitchenUser.kId = '${id}'`

    let list = await db.query(queryString, { type: db.QueryTypes.SELECT })

    
    res.status(200).json(list);
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
