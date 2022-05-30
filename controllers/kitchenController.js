const { json } = require('express/lib/response');
const res = require('express/lib/response');
const db = require('../config/database');
const Kitchens = require('../models/kitchen');
const KitchenUsers = require('../models/kitchenUser')

const Refrigerator = require('../models/refrigerator')
const stringHash = require("string-hash");
const KitchenUser = require('../models/kitchenUser');
const BeverageType = require('../models/beverageType');

exports.createKitchen = async function (req, res) {
    try {
        var kitchen = req.body
        var passEncrypt = stringHash(kitchen.kPass)
        kitchen.kPass = passEncrypt
        
        var kitchenResult = await Kitchens.create(kitchen)
        
        var id = kitchenResult.id
        await BeverageType.create({kId: id, beverageName: 'Carlsberg', beverageType: 'beer', pictureUrl: 'carlsberg.png'})
        await BeverageType.create({kId: id, beverageName: 'Tuborg', beverageType: 'beer', pictureUrl: 'tuborg.png'})
        await BeverageType.create({kId: id, beverageName: 'Tuborg Classic', beverageType: 'beer', pictureUrl: 'classic.png'})
        await BeverageType.create({kId: id, beverageName: 'Royal Export', beverageType: 'beer', pictureUrl: 'rexport.png'})
        await BeverageType.create({kId: id, beverageName: 'Royal Pilsner', beverageType: 'beer', pictureUrl: 'rpilsner.png'})
        await BeverageType.create({kId: id, beverageName: 'Carls Special', beverageType: 'beer', pictureUrl: 'carlsspecial.png'})
        await BeverageType.create({kId: id, beverageName: 'Tuborg Guld', beverageType: 'beer', pictureUrl: 'guld.png'})
        await BeverageType.create({kId: id, beverageName: 'Heineken', beverageType: 'beer', pictureUrl: 'heineken.png'})
        await BeverageType.create({kId: id, beverageName: 'Tuborg Julebryg', beverageType: 'beer', pictureUrl: 'julebryg.png'})
        await BeverageType.create({kId: id, beverageName: 'Tuborg Rå', beverageType: 'beer', pictureUrl: 'raa.png'})
        await BeverageType.create({kId: id, beverageName: 'Royal Classic', beverageType: 'beer', pictureUrl: 'rclassic.png'})


        res.status(201).send(true)


    } catch (e) {
        sendErrorCode(e, res);
    }
}
exports.login = async function (req, res) {
    try {
        
        var kitchen = req.body

        var pass = kitchen.kPass
        var hashedPass = stringHash(pass)

        var kitchen = await Kitchens.findOne({ where: { kName: kitchen.kName} });
        
        if(kitchen.kPass == hashedPass){
            res.status(200).json(kitchen)
            return
        }
        res.status(401).send(false)
     

    
    } catch (e) {

        res.status(400).send(e);
    }
}

exports.getKitchenList = async function (req, res) {
    try {
        var kitchens = await Kitchens.findAll()
        res.status(200).json(kitchens)
    } catch (error) {
        sendErrorCode(error, res)
    }
}

exports.getKitchen = async function (req, res) {
    try {
        var kitchen = await Kitchens.findOne({ where: { id: req.params.id} });
        res.status(200).json(kitchen)
    } catch (e) {
        sendErrorCode(e, res)
    }
}

exports.postKitchenUser = async function(req, res) {
    try {
        var kId = req.params.id
        var uId = req.params.uId
        await KitchenUsers.create({kId: kId, uId: uId})      
        res.status(201).send(true)  
    } catch (e) {
        sendErrorCode(e, res)
    }

}

exports.getKitchenUsers = async function(req, res){
    try {
      
        var userList = await KitchenUsers.findAll({ where: { kId: req.params.id} })
       // var userListR =  db.query(`SELECT * FROM [dbo].[KitchenUsers] WHERE kId LIKE ${req.params.id}`)   
        console.log("AHAAG")
        res.status(200).json(userList)
    } catch (e) {
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
        case "SequelizeValidationError":
            res.status(409).send(e);
            break;
        default:
            res.status(400).send(e);
    }
}