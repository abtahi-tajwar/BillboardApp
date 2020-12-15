const express = require('express')

const userRouter = require('./routers/user')
const advertiseRouter = require('./routers/advertise')

require('./db/mongoose-connect')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(advertiseRouter)

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is running at ', 'http://localhost:'+port+'/')
})