const express = require('express')
const userRouter = express.Router()

const userController = require('../controllers/userController')

userRouter.route('/')
.get(userController.getUserList)
.post(userController.createUser)



userRouter.route('/:id')
.delete(userController.deleteUser)
.put(userController.updateUser)
.get(userController.getUser)

userRouter.route('/login')
.post(userController.login)

userRouter.route('/:id/assigned')
.get(userController.isAssigned)

module.exports = userRouter