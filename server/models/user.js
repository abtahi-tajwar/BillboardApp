const mongoose = require('../db/mongoose-connect')
const validator = require('validator')

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is not valid')
                }
            }
        }
    }, 
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                if(!value.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*(){}[\]<>])[a-zA-Z0-9!@#$%&*(){}[\]<>]{8,}/)) {
                    throw new Error('Password must contain 1 uppercase, 1 lowercase, 1 special character and it has at least 8 characters')
                }
            }
        }
    }
})