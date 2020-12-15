const validator = require('validator')
const mongoose = require('mongoose')
const { validate } = require('./user')

const Advertise = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    coverImages: [{
        image: Buffer
    }],
    baseInfo: {
        type: String,
        trim: true,
        validate(value) {
            if(value.length > 10) {
                throw new Error('Please do not write anything more that 10 characters')
            }
        }
    },
    isOnline: {
        type: Boolean
    },
    website: {
        type: String,
        validate(url) {
            if(!validate.isURL(url)) {
                throw new Error('Please provide a valid web url')
            }
        }
    },    
    location: {
        place: {
            type: String,
            trim: true
        }, street: {
            type: String,
            trim: true
        }, area: {
            type: String,
            trim: true,
        }, district: {
            type: String,
            trim: true,
        }, country: {
            type: String,
            trim: true
        }
    },
    products: [{
        name: {
            type: String
        },
        image: {
            type: Buffer
        }
    }],
    expire_date: {
        // How to manipulate date data
        // const date = new Date('mm.dd.yyyy h:m:s')
        // const timestamp = date.getTime()
        type: String
    },
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
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Review'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Advertise', Advertise)