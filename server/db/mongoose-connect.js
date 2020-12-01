const mongoose = require('mongoose')
mongoose.connect('http://localhost:27017/billboardApp', {
    useNewUrlParser: true
})
module.exports = mongoose