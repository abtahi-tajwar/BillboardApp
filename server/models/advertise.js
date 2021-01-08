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
        type: Buffer
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
        count: {
            type: String,
            default: 0
        },
        users: [{
            name: {
                type: String
            },
            id: {
                type: mongoose.Schema.Types.ObjectId
            }
        }]
    },
    comments: [{
        name: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        commentText: {
            type: String
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
    }],
    categories: [{
        type: String
    }],
    tags: [{
        type: String
    }]
}, {
    timestamps: true
})

Advertise.methods.getInfo = function () {
    return {
        title: this.title,
        description: this.description
    }
}

module.exports = mongoose.model('Advertise', Advertise)