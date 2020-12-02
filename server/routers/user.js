const express = require('express')
const User = require('../models/user')

const userRouter = new express.Router()

userRouter.post('/user/register', async (req, res) => {    
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.genToken()        
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = userRouter