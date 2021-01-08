const mongoose = require('mongoose')

const Categories = new mongoose.Schema({
    category: [{
        name: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
})

module.exports = mongoose.model('Categories', Categories)