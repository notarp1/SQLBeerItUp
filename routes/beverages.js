const express = require('express')
const fridgeRouter = express.Router()

const fridgeController = require('../controllers/refrigeratorController')


fridgeRouter.route('/beverages')
.get(fridgeController.getBeverageTypes)
.post()




module.exports = fridgeRouter