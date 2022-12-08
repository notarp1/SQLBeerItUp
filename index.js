const express = require('express')
const app = express()

const db = require('./config/database')
const userRouter  = require('./routes/userRouter')
const kitchenRouter = require('./routes/kitchenRouter')
const mainRouter = require('./routes/mainRouter')

db.authenticate()
.then(() => console.log('Database connected..'))
.catch(err => console.log("Error: " + err))


app.use(express.json())
app.use('/users', userRouter)

app.use('/kitchens', kitchenRouter)
app.use('/', mainRouter)

//app.listen(3000, () => {
 //   console.log("Listening on port 3000")
 //})

// app.listen(process.env.PORT, () => {
//     console.log("Listening on port 3000")
// })

module.exports = app;
