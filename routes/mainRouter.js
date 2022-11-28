const express = require('express')
const mainRouter = express.Router()
const logController = require('../controllers/logController')


mainRouter.route('/serverstatus')
.get(logController.checkInternetConnection)

module.exports = mainRouter