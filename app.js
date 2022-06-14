const express = require('express')
const app = express()

const db = require('./config/database')
const userRouter = require('./routes/users')
const kitchenRouter = require('./routes/kitchens')


db.authenticate()
.then(() => console.log('Database connected..'))
.catch(err => console.log("Error: " + err))


app.use(express.json())
app.use('/users', userRouter)

app.use('/kitchens', kitchenRouter)

app.listen(process.env.PORT, () => {
    console.log("Listening on port 3000")
})
