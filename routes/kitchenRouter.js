const express = require('express')
const kitchenRouter = express.Router()

const kitchenController = require('../controllers/kitchenController')
const beverageController = require('../controllers/beverageController')
const logController = require('../controllers/logController')
const shoppingCartController = require('../controllers/shoppingCartController')


kitchenRouter.route('/')
.get(kitchenController.getAllKitchens)
.post(kitchenController.createKitchen)



kitchenRouter.route('/auth')
.post(kitchenController.kitchenAuthentication)

kitchenRouter.route('/name_check/:name')
.get(kitchenController.isKitchenNameAvailable)



kitchenRouter.route('/login')
.post(kitchenController.login)

kitchenRouter.route('/:id/beverages/type')
.post(kitchenController.addBeverageType)

kitchenRouter.route('/:id')
.get(kitchenController.getKitchen)

kitchenRouter.route('/:id/shopping_cart')
.get(shoppingCartController.getAllItems)
.post(shoppingCartController.addItemToCart)
.put(shoppingCartController.updateCartItem)



kitchenRouter.route('/:id/admins')
.post(kitchenController.giveUserAdminRights)

kitchenRouter.route('/:id/isAdmin/:uId')
.get(kitchenController.isAdmin)


kitchenRouter.route('/:id/isOnlyAdmin/:uId')
.get(kitchenController.isTheOnlyAdminSpecific)



kitchenRouter.route('/:id/users/:uId')
.get(kitchenController.getKitchenUser)
.delete(kitchenController.deleteKitchenUser)


kitchenRouter.route('/:id/users')
.get(kitchenController.getKitchenUsers)
.post(kitchenController.postKitchenUser)


kitchenRouter.route('/:id/beverages/price-calculation')
.post(beverageController.calculateBeverageCostSequential)

kitchenRouter.route('/:id/beverages/transaction-accepted/:uId')
.post(beverageController.onBeverageTransactionAccept)

kitchenRouter.route('/:id/beverages/stock/all/:type')
.get(beverageController.getBeveragesInStock)

kitchenRouter.route('/:id/beverages/stock/specific/:beverageId')
.get(beverageController.getSpecificBeverage)

kitchenRouter.route('/:id/beverages')
.get(beverageController.getBeverages)
.post(beverageController.addBeverages)

kitchenRouter.route('/:id/beverages/all/:type')
.get(beverageController.getBeverageTypes)







kitchenRouter.route('/:id/leaderboard/:year/:month')
.get(logController.calculateMonthlyLeaderboard)

kitchenRouter.route('/:id/leaderboard/:year')
.get(logController.calculateYearlyLeaderboard)





module.exports = kitchenRouter
