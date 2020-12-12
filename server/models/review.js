const mongoose = require('mongoose')

const Review = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    }, 
    description: {
        type: String,
    },    
    products: [{
        name: {
            type: String,
            trim: true
        },
        image: {
            type: Buffer
        }
    }],
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        commentText: {
            type: String
        },
        commentLikes: {
            type: Number
        }
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    referredOffers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertise'
    }]
})

module.exports = mongoose.model('Review', Review)