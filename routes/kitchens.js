const express = require('express')
const kitchenRouter = express.Router()

const kitchenController = require('../controllers/kitchenController')
const fridgeController = require('../controllers/refrigeratorController')

kitchenRouter.route('/')
.get(kitchenController.getKitchenList)
.post(kitchenController.createKitchen)





kitchenRouter.route('/login')
.post(kitchenController.login)


kitchenRouter.route('/:id')
.get(kitchenController.getKitchen)

kitchenRouter.route('/:id/users')
.get(kitchenController.getKitchenUsers)

kitchenRouter.route('/:id/users/add/:uId')
.post(kitchenController.postKitchenUser)




kitchenRouter.route('/:id/beverages/in-stock')
.get(fridgeController.getBeveragesInStock)

kitchenRouter.route('/:id/beverages')
.get(fridgeController.getBeverages)

kitchenRouter.route('/:id/beverage-types')
.get(fridgeController.getBeverageTypes)

kitchenRouter.route('/:id/beverages/add/:beverage')
.post(fridgeController.addBeverages)

kitchenRouter.route('/:id/beverages/get/:beverageId')
.get(fridgeController.getSpecificBeverage)




module.exports = kitchenRouter
