const express = require('express')

require('./db/mongoose-connect')

const app = express()
const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is running at ', 'http://localhost:'+port+'/')
})