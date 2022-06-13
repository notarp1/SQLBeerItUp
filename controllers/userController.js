
const res = require('express/lib/response');
const db = require('../config/database');
const Users = require('../models/user');
const KitchenUsers = require('../models/kitchenUser');
const stringHash = require("string-hash")




exports.isAssigned = async function (req, res){
    try {
        var kitchenlist = await KitchenUsers.findAll({where: {uId: req.params.id}})
        var kitchen = kitchenlist[0]
        if(kitchenlist.length > 0) res.status(200).json({isAssigned: true,
        kId: kitchen.kId});
        else  res.status(200).json({isAssigned: false,
            kId: -1});
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
    }
}

exports.emailExists = async function (req, res){
    try {
        var userList = await Users.findAll({where: {uEmail: req.params.email}})
        var users = userList[0]
        if(userList.length > 0) res.status(200).send(false);
        else res.status(200).send(true);;
    } catch (e) {
        console.log(e.code)
        res.status(400).send(e);
    }
}

//Password Encryption
exports.createUser = async function (req, res) {
    try {
       
        var user = req.body
        console.log(user)
        var passEncrypt = stringHash(user.uPass)
        user.uPass = passEncrypt
        

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
      
        if(user.uPass == hashedPass){
            res.status(200).json(user)
            return
        }
        res.status(401).send(false)
     

        
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
