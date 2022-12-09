const express = require('express')
const app = express()
app.use(express.json())

const db = require('./config/database')
db.authenticate()
.then(() => console.log('Database connected..'))
.catch(err => console.log("Error: " + err))


const userRouter  = require('./routes/userRouter')
const kitchenRouter = require('./routes/kitchenRouter')
const mainRouter = require('./routes/mainRouter')

app.use('/', mainRouter)
app.use('/users', userRouter)
app.use('/kitchens', kitchenRouter)


app.listen(3000, () => {
 console.log("Listening on port 3000")
})

// app.listen(process.env.PORT, () => {
//     console.log("Listening on port 3000")
// })

module.exports = app;
