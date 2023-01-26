const express = require('express')

const { Spot, SpotImage, Review, User } = require('../../db/models');
const Sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//tester to see if migration worked
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    let spotsArray = []
    for (let spot of spots) {
        const spotJSON = spot.toJSON()

        let reviews = await Review.findAll({
            where: { spotId: spotJSON.id },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        })
        spotJSON.avgRating = reviews[0].toJSON().avgRating

        spotsArray.push(spotJSON)
    }

    res.json({ Spots: spotsArray })
})



// post a spot
router.post('/', requireAuth, async (req, res) => {
    // Your code here
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const owner = await Spot.findByPk(req.params.ownerId)
    const spot = await Spot.create({
        ownerId: owner,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.json(spot)
})


//(One-to-Many)
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // Your code here
    const spot = await Spot.findByPk(req.params.spotId)
    const { url, preview } = req.body

    const image = await SpotImage.create({
        url,
        preview,
        spotId: spot.id
    })

    res.json(image)
})


//get spot of current user
router.get('/current', requireAuth, async (req, res) => {
    const userSpots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })
    res.status(200).json(userSpots)
})

//Details of a Spot from an id

router.get('/:spotId', async (req, res) => {

    const numberReviews = await Review.count('id')

    const spotId = await Spot.findByPk(req.params.spotId)

    const spots = await Spot.findAll()

    const owner = await User.findAll()

    const spotImages = await SpotImage.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    let spotsArray = []
    for (let spot of spots) {
        const spotJSON = spot.toJSON()

        let reviews = await Review.findAll({
            where: { spotId: spotJSON.id },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        })
        spotJSON.avgRating = reviews[0].toJSON().avgRating
        spotsArray.push(spotJSON)
    }

    const returnSpotId = {
        "id": spotId.id,
        "ownerId": req.user.id,
        "address": spotId.address,
        "city": spotId.city,
        "state": spotId.state,
        "country": spotId.country,
        "lat": spotId.lat,
        "lng": spotId.lng,
        "name": spotId.name,
        "description": spotId.description,
        "price": spotId.price,
        "createdAt": spotId.createdAt,
        "updatedAt": spotId.updatedAt,
        "numReviews": numberReviews,
        "avgStarRating": spotsArray[0].avgRating,
        "spotImages": spotImages,
        "Owner": { "id": owner[0].id, "firstname": owner[0].firstname, "lastname": owner[0].lastname }
    }

    res.json(returnSpotId)
})


router.put('/:spotId', async (req, res) => {
    // const spotId = await Spot.findOne({
    //     where: { id: req.params.spotId },
    //     attributes: {
    //         exclude: [
    //             'avgRating'
    //         ]
    //     }
    // })

    const spotId = await Spot.findByPk(req.params.spotId)
    if (!spotId) return

    const { address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt } = req.body

    spotId.set({
        address: req.body.address
    })
    await spotId.save()
    // const newSpotId = {
    //     address,
    //     city,
    //     state,
    //     country,
    //     lat,
    //     lng,
    //     name,
    //     description,
    //     price,
    //     createdAt,
    //     updatedAt
    // }
    // const spots = await Spot.findAll()
    const updatedSpotId = await Spot.findByPk(req.params.spotId)


    console.log(updatedSpotId)
    res.json(updatedSpotId)
})


router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = await Spot.findByPk(req.params.spotId)
    // await Spot.destroy({
    //     where: {
    //         id: req.params.spotId
    //     }
    // })

    // if (!spotId) res.json({
    //     "message": "Spot couldn't be found",
    //     "statusCode": 404
    // })
    spotId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
