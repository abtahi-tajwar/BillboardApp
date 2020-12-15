const express = require('express')

const Advertise = require('../models/advertise')
const auth = require('../middleware/userAuthorization')

const advertiseRouter = new express.Router()

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
module.exports = advertiseRouter