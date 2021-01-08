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
const productPicture = multer({
    limit: {
        fileSize: 5000000 
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
        res.status(201).send(advertise)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.get('/advertise/:id', auth, async (req, res) => {
    try {
        const ad = await Advertise.findById(req.params.id)
        res.status(200).send(ad)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.delete('/advertise/:id', auth, async (req, res) => {
    try {
        const ad = await Advertise.findOne({ _id: req.params.id, author: req.user._id })
        if(!ad) {
            return res.status(404).send('No matching ad found')
        }
        await ad.remove()
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
    let isLocationUpdatesAllowed = true
    let locationChanges = []
    if(changes.includes('location')) {
        locationChanges = Object.keys(req.body.location)
        isLocationUpdatesAllowed = locationChanges.every(item => allowedLocationChanges.includes(item))
    }
    if(!isUpdatesAllowed || !isLocationUpdatesAllowed) {
        return res.status(400).send('Some updates are invalid')
    }
    try {
        const ad = await Advertise.findOne({ _id: req.params.id, author: req.user._id })
        changes.forEach(change => {
            if(change === 'location') {
                locationChanges.forEach(item => {                    
                    ad.location[item] = req.body.location[item]
                })
            } else {
                ad[change] = req.body[change]
            }
        })
        await ad.save()
        res.status(200).send(ad)
    } catch (e) {
        res.status(500).send(e)
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
        const ad = await findOne({ _id: req.params.id, author: req.user.id })
        if(!ad) {
            res.status(404).send('Advertise not found')
        }
        ad.coverImages.splice(req.params.serial + 1, req.params.serial)
        await ad.save()  

    } catch (e) {
        res.status(500).send()
    }   
    
})
advertiseRouter.post('/advertise/product/:id', auth, productPicture.single('productPicture'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ height: 500, width: 500 }).jpeg().toBuffer()
        const ad = await Advertise.findOne({ _id: req.params.id, author: req.user._id })
        if(!ad) {
            return res.status(404).send('Advertise Not Found')
        }        
        ad.products.push({ name: req.body.name, image: buffer })
        await ad.save()
        res.status(200).send(ad) 
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.delete('/advertise/product/:id/:pid', auth, async (req, res) => {
    try {
        const ad = await Advertise.findOne({ _id: req.params.id, author: req.user._id })                
        if(!ad) {
            return res.status(404).send('Advertise Not Found')
        }        
        ad.products.forEach((product, i) => {
            if(product.id === req.params.pid) {
                ad.products.splice(i, i)
            }
        })
        await ad.save()
        res.status(202).send(ad)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.patch('/advertise/product/:id/:pid', auth, async (req, res) => {
    try {
        const ad = await Advertise.findOne({ _id: req.params.id, author: req.user._id })
        if(!ad) {
            return res.status(404).send('Advertise Not Found')
        }
        ad.products.forEach((product, i) => {
            if(product.id === req.params.pid) {
                product.name = req.body.name
            }
        })
        await ad.save()
        res.status(200).send(ad.products)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.get('/advertise', auth, async (req, res) => {
    try {
        const ads = await Advertise.find({ author: req.user._id })
        res.status(200).send(ads)
    } catch (e) {
        res.status(500).send()
    }
})
advertiseRouter.patch('/advertise/like/:id', auth, async (req, res) => {

        const ad = await Advertise.findById(req.params.id)
        if(!ad) {
            res.status(404).send('Invalid Ad ID')
        }
        ad.likes.count += 1
        const data = {
            name: req.user.name,
            id: req.user._id
        }
        ad.likes.users.push(data)
        await ad.save()
        res.status(200).send()


        res.status(500).send()

})
advertiseRouter.patch('/advertise/comment/:id', auth, async (req, res) => {
    try {
        const ad = await Advertise.findById(req.params.id)
        if(!ad) {
            res.status(404).send('Invalid Ad ID')
        }
        const data = {
            name: req.user.name,
            id: req.user._id,
            commentText: req.body.commentText
        }
        ad.comments.push(data)
        ad.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = advertiseRouter