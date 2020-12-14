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
module.exports = advertiseRouter