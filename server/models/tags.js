const mongoose = require('mongoose')

const Tags = new mongoose.Schema({
    tag: [{
        name: {
            type: String,
            trim: true,
            lowercase: true
        },
        follower: {
            type: Number,
            default: 0
        }
    }]
})