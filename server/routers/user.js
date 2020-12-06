const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middleware/userAuthorization')

const userRouter = new express.Router()
const avatar = multer({
    limit: {
        fileSize: 10000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error('Only upload jpg/jpeg/png file'))
        }
        callback(undefined, true)
    }
    
})

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
userRouter.get('/user/logout', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = user.tokens.filter(token => token.token !== req.token)
        await user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})
userRouter.delete('/user/me', auth, async (req, res) => {
    try { 
        await req.user.remove()
        res.status(202).send()
    } catch (e) {
        res.status(500).send()
    }
})
userRouter.get('/user/me', auth, async (req, res) => {
    const user = req.user
    res.status(200).send(user)
})
userRouter.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', 'avatar', 'type']

    const isUpdateAllowed = updates.every((update) => allowedUpdates.includes(update))

    if(!isUpdateAllowed) {
        return res.status(405).send('Some updates are not allowed')
    }

    const user = req.user
    updates.forEach(update => user[update] = req.body[update])
    await user.save()
    res.status(200).send(user)
})
userRouter.post('/user/avatar/me', auth, avatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 500, height: 500}).jpeg().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(201).send()
}, (error, req, res, next) => {
    res.status(405).send({error: error.message})
})
userRouter.delete('/user/avatar/me', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(202).send()
})
module.exports = userRouter