const mongoose = require('mongoose')
const validator = require('validator')

const Event = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }, 
    description: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    website: {
        type: String,
        validate(url) {
            if(!validator.isURL(url)) {
                throw new Error('Please provide valid URL')
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
    bannerImage: {
        type: Buffer
    },
    goingCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comment: [{
        commentText: {
            type: String,
        }, 
        commentLikes: {
            type: Number,
            default: 0
        }
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Event', Event)