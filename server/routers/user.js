const express = require('express')

const User = require('../models/user')
const auth = require('../middleware/userAuthorization')

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

userRouter.post('/user/login', async (req, res) => {
    try {
        const user = await User.checkAuthorization(req.body.email, req.body.password)
        const token = await user.genToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(404).send(e)
    }
})

userRouter.get('/user/me', auth, async (req, res) => {
    const user = req.user
    res.status(200).send(user)
})

module.exports = userRouter