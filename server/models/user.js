const mongoose = require('../db/mongoose-connect')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is not valid')
            }
        }        
    }, 
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!value.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*(){}[\]<>])[a-zA-Z0-9!@#$%&*(){}[\]<>]{8,}/)) {
                throw new Error('Password must contain 1 uppercase, 1 lowercase, 1 special character and it has at least 8 characters')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    type: {
        type: String
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

User.methods.genToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token

}
User.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
User.statics.checkAuthorization = async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) {
        throw new Error('Invalid email or password')
    }
    const encrypted_password = user.password
    const matched = await bcryptjs.compare(password, encrypted_password)
    if(!matched) {
        throw new Error('Invalid email or password')
    }
    return user
}

User.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)
    }
    next()
})

module.exports = mongoose.model('User', User)