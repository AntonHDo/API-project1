const express = require('express')
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const Sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { convertDate } = require('../../utils/validation')

const router = express.Router();

//get spot
router.get('/', requireAuth, async (req, res) => {
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

    const spotErr = {
        message: "Validation Error",
        statusCode: 400,
        errors: {},
    };

    if (!address) spotErr.errors.address = "Street address is required";
    if (!city) spotErr.errors.city = "City is required";
    if (!state) spotErr.errors.state = "State is required";
    if (!country) spotErr.errors.country = "Country is required";
    if (!lat) spotErr.errors.lat = "Latitude is not valid";
    if (!lng) spotErr.errors.lng = "Longitude is not valid";
    if (!name) spotErr.errors.name = "Name must be less than 50 characters";
    if (!description) spotErr.errors.description = "Description is required";
    if (!price) spotErr.errors.price = "Price per day is required";

    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price
    ) {
        res.statusCode = 400;
        return res.json(spotErr);
    }


    const owner = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })

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


//post a image on spots based on spotId
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // Your code here
    const spot = await Spot.findByPk(req.params.spotId, {
        where: {
            spotId: req.user.id
        }
    })

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const { url, preview, updatedAt, createdAt } = req.body


    let newImage = await SpotImage.create({
        url,
        preview,
        spotId: req.params.spotId
    })

    await SpotImage.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    res.json(newImage)
})


//get spot of current user
router.get('/current', requireAuth, async (req, res) => {
    const userSpots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })
    let spotsArray = []
    for (let spot of userSpots) {
        const spotJSON = spot.toJSON()

        let reviews = await Review.findAll({
            where: { spotId: spotJSON.id },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        })
        spotJSON.avgRating = reviews[0].toJSON().avgRating

        spotsArray.push(spotJSON)
    }

    const allSpot = {
        "id": userSpots[0].id,
        "ownerId": req.user.id,
        "address": userSpots[0].address,
        "city": userSpots[0].city,
        "state": userSpots[0].state,
        "country": userSpots[0].country,
        "lat": userSpots[0].lat,
        "lng": userSpots[0].lng,
        "name": userSpots[0].name,
        "description": userSpots[0].description,
        "price": userSpots[0].price,
        "createdAt": userSpots[0].createdAt,
        "updatedAt": userSpots[0].updatedAt,
        "avgRating": spotsArray[0].avgRating,
        "previewImage": userSpots[0].previewImage
    }

    res.status(200).json({ Spots: [allSpot] })
})


//Details of a Spot from an id

router.get('/:spotId', requireAuth, async (req, res) => {

    const spotId = await Spot.findByPk(req.params.spotId, {
        where: { ownerId: req.user.id }
    })

    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    const numberReviews = await Review.count('id')


    const spots = await Spot.findAll({
        where: { ownerId: req.user.id }
    })

    const owner = await User.findAll({
        where: { id: spotId.ownerId },
        attributes: ['id', 'firstname', 'lastname']
    })

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
        "ownerId": spotId.ownerId,
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
        "Owner": owner
    }

    res.json(returnSpotId)
})

//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {

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


    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price
    ) {
        return res.status(400).json(spotEditErr);
    }


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
    const spots = await Spot.findByPk(req.params.spotId,
        {
            where: {
                ownerId: req.user.id
            }
        })
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
    if (stars < 1 || stars > 5) {
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "error": {
                "stars": "Stars must be an integer from 1 to 5"
            }
        })
    }
    if (!review) reviewErr.errors.review = "Review text is required"
    if (!stars) reviewErr.errors.stars = "Stars must be an integer from 1 to 5"

    if (!review || !stars) res.status(404).json(reviewErr)

    const reviewSpot = await Review.findAll({
        where: {
            spotId: spots.id
        }
    })

    const currentReviewer = await Review.findOne({
        where: {
            userId: req.user.id,
            spotId: req.params.spotId
        }
    })

    if (currentReviewer) {
        res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    }

    const reviews = await Review.create({
        userId: req.user.id,
        spotId: reviewSpot[0].spotId,
        review,
        stars,
        createdAt: reviewSpot.createdAt,
        updatedAt: reviewSpot.updatedAt
    })

    res.json(reviews)
})

// get a spots review
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const spotId = await Spot.findByPk(req.params.spotId, {
        where: {
            spotId: req.user.id
        },
        attributes: {
            exclude: ['description', 'avgRating', 'createdAt', 'updatedAt']
        }
    })

    if (!spotId) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404,
        });
    }

    const allReviews = await Review.findAll({
        where: {
            userId: req.user.id
        }
    })

    const userName = await User.findAll({
        attributes: ['id', 'firstname', 'lastname'],
        where: {
            id: allReviews[0].userId
        }
    })

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: allReviews[0].id
        }
    })

    const reviews = {
        Reviews: {
            id: allReviews[0].id,
            userId: allReviews[0].userId,
            spotId: allReviews[0].spotId,
            review: allReviews[0].review,
            stars: allReviews[0].stars,
            createdAt: allReviews[0].createdAt,
            updatedAt: allReviews[0].updatedAt,
            User: userName[0],
            "ReviewImages": reviewImages
        }
    }

    res.json(reviews)
})


//get all booking for a spots based on spots Id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    let spotId = await Spot.findByPk(req.params.spotId)

    if (!spotId) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const allBookings = await Booking.findAll({
        where: {
            spotId: spotId.id
        }
    })

    const allUsers = await User.findAll({
        where: {
            id: spotId.ownerId
        },
        attributes: ['id', 'firstname', 'lastname']
    })

    const bookingSpots = {
        "User": allUsers[0],
        "id": allBookings[0].id,
        "spotId": allBookings[0].spotId,
        "userId": allBookings[0].userId,
        "startDate": allBookings[0].startDate,
        "endDate": allBookings[0].endDate,
        "createdAt": allBookings[0].createdAt,
        "updatedAt": allBookings[0].updatedAt
    }

    res.json({ Bookings: [bookingSpots] })
})


//Create a booking based on Spot Id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = await Spot.findByPk(req.params.spotId,
        {
            where: {
                ownerId: req.user.id
            }
        })

    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const { startDate, endDate } = req.body

    const bookingErr = {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {}
    }


    const startMiliSec = convertDate(startDate)
    const endMiliSec = convertDate(endDate)

    if (startMiliSec > endMiliSec) {
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "error": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }

    const allBookings = await Booking.findAll({
        where: {
            spotId: spotId.id
        }
    })

    for (let booking of allBookings) {
        const bookingStartMiliSec = convertDate(booking.startDate)
        const bookingEndMiliSec = convertDate(booking.endDate)
        if (bookingStartMiliSec === startMiliSec || bookingEndMiliSec === endMiliSec) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "error": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
    }


    const postBooking = await Booking.create({
        spotId: spotId.id,
        userId: req.user.id,
        startDate,
        endDate,
        createdAt: allBookings[0].createdAt,
        updatedAt: allBookings[0].updatedAt

    })

    res.json(postBooking)
})


// delete a spot
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
