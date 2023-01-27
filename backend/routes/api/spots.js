const express = require('express')
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const Sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { Model } = require('sequelize');
const router = express.Router();

//get spot
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
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



    res.json({ Spots: spotsArray })
})



// post a spot
router.post('/', requireAuth, async (req, res) => {
    // Your code here
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const owner = await User.findAll()
    const spot = await Spot.create({
        ownerId: owner[0].id,
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


//post a spotimage on spots based on spotId
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

    // const allSpot = {
    //     "id": 1,
    //     "ownerId": 1,
    //     "address": "123 Disney Lane",
    //     "city": "San Francisco",
    //     "state": "California",
    //     "country": "United States of America",
    //     "lat": 37.7645358,
    //     "lng": -122.4730327,
    //     "name": "App Academy",
    //     "description": "Place where web developers are created",
    //     "price": 123,
    //     "createdAt":
    //         "updatedAt":
    //     "avgRating":
    //         "previewImage": "image url"
    // }

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

    const spotId = await Spot.findByPk(req.params.spotId,
        {
            attributes: {
                exclude: ['avgRating', 'previewImage']
            }
        }
    )
    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const { address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt } = req.body

    const spotEditErr = {
        message: "Validation Error",
        statusCode: 400,
        errors: {}
    }

    if (!address) spotEditErr.errors.address = "Street address is required"
    if (!city) spotEditErr.errors.city = "Street address is required"
    if (!state) spotEditErr.errors.state = "City is required"
    if (!country) spotEditErr.errors.country = "Country is required"
    if (!lat) spotEditErr.errors.lat = "Latitude is not valid"
    if (!lng) spotEditErr.errors.lng = "Longitude is not valid"
    if (!name) spotEditErr.errors.name = "Name must be less than 50 characters"
    if (!description) spotEditErr.errors.description = "Description is required"
    if (!price) spotEditErr.errors.price = "Price per day is required"
    res.json(spotEditErr)

    const newSpotId = {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt,
        updatedAt
    }

    await spotId.update(newSpotId)

    res.json(spotId)
})

//post a review on spots by spotId
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    // Your code here
    const spots = await Spot.findByPk(req.params.spotId)
    if (!spots) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const { review, stars } = req.body
    const reviewErr = {
        message: "Validation Error",
        statusCode: 400,
        errors: {}
    }
    if (!review) reviewErr.errors.review = "Review text is required"
    if (!stars) reviewErr.errors.stars = "Stars must be an integer from 1 to 5"
    res.status(404).json(reviewErr)

    const reviews = await Review.create({
        userId: spots.ownerId,
        spotId: spots.id,
        review,
        stars,
        createdAt: spots.createdAt,
        updatedAt: spots.updatedAt
    })

    res.json(reviews)
})


router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const spotId = await Spot.findByPk(req.params.spotId, {
        attributes: {
            exclude: ['description', 'avgRating', 'createdAt', 'updatedAt']
        }
    })
    const allReviews = await Review.findAll()
    const allReviewImages = await ReviewImage.findAll({
        attributes: {
            exclude: ['reviewId', 'createdAt', 'updatedAt']
        }
    })
    const userName = await User.findAll({
        attributes: ['id', 'firstname', 'lastname'],
        where: {
            id: req.user.id
        }
    })

    const returnReviews = {
        "id": allReviews[0].id,
        "userId": req.user.id,
        "spotId": spotId.id,
        "review": allReviews[0].review,
        "stars": allReviews[0].stars,
        "createdAt": allReviews[0].createdAt,
        "updatedAt": allReviews[0].updatedAt,
        "User": userName[0],
        "Spot": spotId,
        "ReviewImages": allReviewImages
    }

    res.json({ "Reviews": [returnReviews] })
})


router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = await Spot.findByPk(req.params.spotId)
    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    await spotId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})




module.exports = router;
