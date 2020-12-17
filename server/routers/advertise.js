const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const Advertise = require('../models/advertise')
const auth = require('../middleware/userAuthorization')
const user = require('../models/user')

const advertiseRouter = new express.Router()
const advertisePicture = multer({
    limit: {
        fileSize: 20000000 
    }, 
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error('Only upload jpg/jpeg/png file'))
        }
        callback(undefined, true)
    }
})

advertiseRouter.post('/advertise/create', auth, async (req, res) => {
    if(req.user.type !== process.env.USER_TYPE_SELLER) {
        res.status(400).send('You must be a seller to post advertise')
    }
    const advertise = new Advertise(req.body)
    advertise.author = req.user._id
    try {
        await advertise.save()
        res.status(200).send(advertise)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.delete('/advertise/:id', auth, async (req, res) => {
    try {
        const ad = await Advertise.findById(req.params.id)
        if(!ad) {
            return res.status(404).send('No matching ad found')
        }
        ad.remove()
        res.status(202).send(ad)
    } catch (e) {
        res.status(500).send()
    }
    
})
advertiseRouter.patch('/advertise/:id', auth, async (req, res) => {
    const allowedChanges = ['title', 'description', 'baseInfo', 'isOnline', 'location', 'website', 'author', 'likes', 'expire_date']
    const allowedLocationChanges = ['place', 'street', 'area', 'district', 'country']
    const changes = Object.keys(req.body)

    const isUpdatesAllowed = changes.every(item => allowedChanges.includes(item))
    const isLocationUpdatesAllowed = true
    if(changes.includes('location')) {
        isLocationUpdatesAllowed = false
        const locationChanges = Object.keys(req.body.location)
        isLocationUpdatesAllowed = locationChanges.every(item => allowedLocationChanges.includes(item))
    }
    if(!isUpdatesAllowed || !isLocationUpdatesAllowed) {
        return res.status(400).send('Some updates are invalid')
    }
    try {
        const ad = await Advertise.findById(req.params.id)
        changes.forEach(change => ad[change] = req.body[change])
        res.status(200).send(ad)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.post('/advertise/picture/:id', auth, advertisePicture.single('advertisePicture'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ height: 500, width: 1000}).jpeg().toBuffer()
        const ad = await Advertise.findById(req.params.id)
        if(!ad) {
            return res.status(404).send('Advertise not found')
        }
        ad.coverImages.push(buffer)
        await ad.save()
    } catch (e) {
        res.status(500).send()
    }    
})
advertiseRouter.delete('/advertise/picture/:id/:serial', auth, async (req, res) => {
    try {
        const ad = await findOne({ _id: req.params.id, author: user.id })
        if(!ad) {
            res.status(404).send('Advertise not found')
        }
        ad.coverImages.splice(req.params.serial + 1, req.params.serial)
        await ad.save()  

    } catch (e) {
        req.status(500).send()
    }
    
    
})
module.exports = advertiseRouter