const express = require('express')

const userRouter = require('./routers/user')

require('./db/mongoose-connect')

const app = express()

app.use(express.json())
app.use(userRouter)

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is running at ', 'http://localhost:'+port+'/')
})