
const res = require('express/lib/response');
const db = require('../config/database');
const Users = require('../models/User');
const KitchenUsers = require('../models/KitchenUser');
const DeviceTokens = require('../models/DeviceTokens')
const NotificationService = require('../services/notificationService');
const sequelize = require("sequelize");

exports.notifTest = async function (req, res){
    var key = "dJDCvLFYSn26I9ZejkT4qj:APA91bEvgcXvtJMkXphjLJGFBIndbSitemfGjpCuUi-6JbbnvVW8C6jjy8AHx1q1JvAYk6REQPOqMcSZsvRKs-nu8ayW0YqunDvGqzPGLRKSdqEDdr3WBL9wZ0bilNY5ryawIDGqBYA2";
    var payload = {data: {
        MyKey1: "Hello"
    }}
    var options = {
        priority: "high",
        timeToLive: 60*60*24
    }

    try {
        var response = await NotificationService.messaging().sendToDevice(key, payload, options)
    
        res.status(200).json(response)
    } catch (e) {
        res.status(400).send(e);
    }

    
}

exports.setDeviceToken = async function (req, res){
    try {
        await DeviceTokens.upsert({uId: req.params.uId, deviceToken: req.params.deviceToken})
        res.status(200).send({success: true})
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
    }
}

exports.getDeviceToken = async function (req, res){
    try {
        var token = await DeviceTokens.findOne({where: {uId: req.params.uId} })
        res.status(200).json({user: token.deviceToken})
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
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
        var users = userList[0]
        if(userList.length > 0) {
            console.log("fail.")
            res.status(409).send({message: "A user is already registrered with this number!"});
        }else {
            res.status(200).json("true")
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
        sendErrorCode(e, res);
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



exports.deleteUser = async function (req, res) {
    try {
        await Users.destroy({
            where: {
                userPhone: req.params.id //this will be your id that you want to delete
            }
        })
        res.status(200).send(true)

    } catch (e) {
        sendErrorCode(e, res)
    }
}

exports.updateUser = async function (req, res) {
    try {
        var updatedUser = req.body
        var userToUpdate = await Users.findOne({ where: { userPhone: updatedUser.uPhone } });
        
        await userToUpdate.update({ uName: updatedUser.uName, userPhone: updatedUser.uPhone })
      
        res.status(200).send(true)
    } catch (e) {
        sendErrorCode(e, res)
    }
}

exports.getUser = async function (req, res) {
    try {
       
        var user = await Users.findOne({ where: { id: req.params.id} });
    
        res.status(200).json(user)
    } catch (e) {
        console.log("error")
        sendErrorCode(e, res)
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
