const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const _id = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id, 'tokens.token': token})

        if(!user) {
            return res.status(404).send('Please Login or Sign up')
        }
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send('Authentication Failed')
    }
    
}

module.exports = auth