
const res = require('express/lib/response');
const db = require('../config/database');
const Users = require('../models/User');
const KitchenUsers = require('../models/KitchenUser');

const sequelize = require("sequelize");

const KitchenUser = require("../models/KitchenUser");


exports.isAdminOnKitchens = async function (req, res){
    try {
      
    
        let onlyAdmin = false
        var userId = req.params.id

    

        var user =  await KitchenUser.findAll({where: { isAdmin: 1, uId: userId }})

        if(user.length > 0) {
            res.status(200).json(1)
          } else {
            res.status(200).json(0)
          }
   
    } catch (e) {
        handleError(e, res);
    }
  }

 
exports.isAssigned = async function (req, res){
    try {
        var kitchenlist = await KitchenUsers.findAll({where: {uId: req.params.id}})
        var joinedKitchens = []
        
        await kitchenlist.forEach((item) => {
            joinedKitchens.push(item.kId)
            joinedKitchens.push(item.kId)
        });
    
        if(kitchenlist.length > 0) res.status(201).json(joinedKitchens);
        else res.status(200).send([]);
    } catch (e) {
        console.log(e.code)
        res.send(400).send(e);
    }
}


exports.phoneNumberIsAvailable = async function (req, res){
    try {
        var userList = await Users.findAll({where: {uPhone: req.params.phone}})
        if(userList.length > 0) {
            console.log("fail.")
            res.status(409).send({message: "A user is already registrered with this number!"});
        }else {
            res.status(200).send("true")
        }
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
    }
}

exports.phoneNumberIsRegistrered = async function (req, res){
    try {
        var userList = await Users.findAll({where: {uPhone: req.params.phone}})
        var users = userList[0]
        if(userList.length > 0) {
            res.status(200).json("true")
           
        }else {
            res.status(405).send({message: "No account is registrered with this number!"});
        }
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
    }
}

//Password Encryption
exports.createUser = async function (req, res) {
    try {
       
        var user = req.body
        console.log(req.body)
        var userRes = await Users.create(user)
        res.status(201).json(userRes)

    } catch (e) {
        handleError(e, res);
    }
    // db.query("INSERT INTO Users (UserID, UserName, UserPhone) VALUES ('123', 'Christian', '22270704')")   
}

exports.login = async function (req, res) {
    try {
      
        var loginObject = req.body
        var pass = loginObject.uPass

        var hashedPass = stringHash(pass)
        var user = await Users.findOne({ where: { uEmail: loginObject.uEmail} });
        
        if(user == null){
  
            res.status(404).json({ message: 'Not Found'});
            return
        }
        if(user.uPass == hashedPass){
            res.status(200).json(user)
            return
        }
        res.status(401).json({ message: 'Wrong Password' })
     

        
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
    }
}



exports.deleteUser = async function (req, res){
   
    try {

        var id = req.params.id
        var moneyOwed = await db.query(
            `SELECT t1.uName as name, 
            t1.uPhone as phone, 
            t1.id as uId, 
            SUM(price) as total  
            FROM Users t1 
            JOIN Beverages t2 ON t1.id = t2.beverageDrinkerId  
            WHERE beverageOwnerId = '${id}'
            AND beverageDrinkerId != '${id}'
            AND removedAt is not NULL AND settleDate is NULL GROUP BY uName`,
            { type: sequelize.QueryTypes.SELECT }
        )
    
        var moneyOwes = await db.query(
            `SELECT t1.uName as name, t1.uPhone as phone, t1.id as uId, SUM(t2.price) as total FROM Users t1  JOIN Beverages t2 ON t1.id = t2.beverageOwnerId WHERE beverageDrinkerId = '${id}' AND removedAt is not NULL AND settleDate is NULL GROUP BY t1.uName`,
            { type: sequelize.QueryTypes.SELECT }
        )
    
        if(moneyOwed.length > 0 || moneyOwes.length > 0){
            res.status(409).send({message: "You have unsettled transactions, settle them before removing your account!"});
            return
        }

        
        var query = `DELETE FROM Users WHERE id = '${id}'`

        await db.query(query,{ type: sequelize.QueryTypes.DELETE })
        res.status(200).send("Success");
   
    } catch (e) {
    
        console.log(e.code)
        res.send(400).send(e);
    }



}


exports.deleteUserAndKitchen = async function (req, res){
   
    try {

        var id = req.params.id
        var kId = req.params.kId
        var moneyOwed = await db.query(
            `SELECT t1.uName as name, 
            t1.uPhone as phone, 
            t1.id as uId, 
            SUM(price) as total  
            FROM Users t1 
            JOIN Beverages t2 ON t1.id = t2.beverageDrinkerId  
            WHERE beverageOwnerId = '${id}'
            AND beverageDrinkerId != '${id}'
            AND removedAt is not NULL AND settleDate is NULL GROUP BY uName`,
            { type: sequelize.QueryTypes.SELECT }
        )
    
        var moneyOwes = await db.query(
            `SELECT t1.uName as name, t1.uPhone as phone, t1.id as uId, SUM(t2.price) as total FROM Users t1  JOIN Beverages t2 ON t1.id = t2.beverageOwnerId WHERE beverageDrinkerId = '${id}' AND removedAt is not NULL AND settleDate is NULL GROUP BY t1.uName`,
            { type: sequelize.QueryTypes.SELECT }
        )
    
        if(moneyOwed.length > 0 || moneyOwes.length > 0){
            res.status(409).send({message: "You have unsettled transactions, settle them before removing your account!"});
            return
        }

        
        var query = `DELETE FROM Users WHERE id = '${id}'`
       

        await db.query(query,{ type: sequelize.QueryTypes.DELETE })

        var query2 = `DELETE FROM Kitchens WHERE id = '${kId}'`
        await db.query(query2,{ type: sequelize.QueryTypes.DELETE })
        res.status(200).send("Success");
   
    } catch (e) {
    
        console.log(e.code)
        res.send(400).send(e);
    }



}

exports.updateUser = async function (req, res) {
    try {
        var updatedUser = req.body
        var userToUpdate = await Users.findOne({ where: { userPhone: updatedUser.uPhone } });
        
        await userToUpdate.update({ uName: updatedUser.uName, userPhone: updatedUser.uPhone })
      
        res.status(200).send(true)
    } catch (e) {
        handleError(e, res)
    }
}

exports.getUser = async function (req, res) {
    try {
       
        var user = await Users.findOne({ where: { id: req.params.id} });
    
        res.status(200).json(user)
    } catch (e) {
        console.log("error")
        handleError(e, res)
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






