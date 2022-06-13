const express = require('express')
const userRouter = express.Router()
const beverageController = require('../controllers/beverageController')
const userController = require('../controllers/userController')
const logController = require('../controllers/logController')

userRouter.route('/')
.post(userController.createUser)

userRouter.route('/:id/logs/beverages/added')
.get(logController.added)

userRouter.route('/:id/logs/beverages/consumed')
.get(logController.consumed)

userRouter.route('/:id/logs/beverages/bought')
.get(logController.bought)

userRouter.route('/:id/logs/beverages/sold')
.get(logController.sold)





userRouter.route('/:id')
.delete(userController.deleteUser)
.put(userController.updateUser)
.get(userController.getUser)

userRouter.route('/:id/owed')
.get(beverageController.calculateMoneyUserIsOwed)

userRouter.route('/:id/owes')
.get(beverageController.calculateMoneyUserOwes)

userRouter.route('/:id/pay/:recipient')
.get(beverageController.makePayment)




userRouter.route('/login')
.post(userController.login)

userRouter.route('/:id/assigned')
.get(userController.isAssigned)

module.exports = userRouter