const express = require('express')
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const Sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { convertDate } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();


//Add Query Filters
router.get('/', requireAuth, async (req, res) => {
    let { page, size } = req.query
    let pagination = {}
    page = parseInt(page)
    size = parseInt(size)

    const pageSizeErr = {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {}
    }

    if (page === 0) pageSizeErr.errors.page = "Page must be greater than or equal to 1"
    if (size === 0) pageSizeErr.errors.size = "Size must be greater than or equal to 1"


    if (isNaN(page)) page = 1
    if (isNaN(size)) size = 20


    if (page >= 1 && size >= 1) {
        if (size >= 20) {
            pagination.limit = 20
        } else {
            pagination.limit = size
            pagination.offset = size * (page - 1)
        }
    }

    const spots = await Spot.findAll({
        include: {
            model: SpotImage
        }
    }
    )
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

    for (let spot of spotsArray) {
        for (let prev of spot.SpotImages) {
            if (prev.preview === true) {
                spot.previewImage = prev.url
            }
            delete spot.SpotImages
        }
    }

    if (page === 0 || size === 0) {
        res.status(400).json(pageSizeErr)
    }


    res.json({ Spots: spotsArray, page, size })

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


    const spot = await Spot.create({
        ownerId: req.user.id,
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


//create a image on spots based on spotId
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // Your code here
    const spot = await Spot.findByPk(req.params.spotId, {
        where: {
            ownerId: req.user.id
        }
    })

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    if (req.user.id !== spot.ownerId) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    const { url, preview } = req.body

    // const currImages = await SpotImage.findAll({
    //     attributes: ['url', 'preview'],
    //     where: {
    //         spotId: req.params.spotId,
    //     }
    // })

    // console.log(currImages[0])

    let newImage = await spot.createSpotImage({
        spotId: req.params.spotId,
        url,
        preview
    })

    // await SpotImage.findAll({
    //     attributes: {
    //         exclude: ['createdAt', 'updatedAt']
    //     },
    //     where: {
    //         spotId: spot.id
    //     }
    // })
    // console.log("meweeee", newImage.SpotImage)

    res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})


//get spot of current user
router.get('/current', requireAuth, async (req, res) => {
    // const userSpots = await Spot.findAll({
    //     where: {
    //         ownerId: req.user.id
    //     },
    // })

    // let spotsArray = []
    // for (let spot of userSpots) {
    //     const spotJSON = spot.toJSON()

    //     let reviews = await Review.findAll({
    //         where: { spotId: spotJSON.id },
    //         attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
    //     })

    //     let spotImage = await SpotImage.findAll({
    //         attributes: ['url'],
    //         where: { spotId: spotJSON.id }
    //     })
    //     spotJSON.previewImage = spotImage[0].url
    //     spotJSON.avgRating = reviews[0].toJSON().avgRating

    //     spotsArray.push(spotJSON)
    // }
    const allSpotsFromCurrUser = await Spot.findAll({
        include: {
            model: SpotImage
        },
        where: { ownerId: req.user.id }
    })

    let currentUsersSpotsArray = []
    for (let spot of allSpotsFromCurrUser) {
        const spotJSON = spot.toJSON()
        let currentUsersReviews = await Review.findAll({
            where: { spotId: spotJSON.id },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        })

        spotJSON.avgRating = currentUsersReviews[0].toJSON().avgRating

        currentUsersSpotsArray.push(spotJSON)
    }

    for (let spot of currentUsersSpotsArray) {
        for (let prev of spot.SpotImages) {
            if (prev.preview === true) {
                spot.previewImage = prev.url
            }
            delete spot.SpotImages
        }
    }

    // console.log(currentUsersSpotsArray)
    // spotJSON.previewImage = currentusersSpotImage[0]

    // for (let spots of currentUsersSpotsArray) {
    //     console.log(spots)
    // }

    res.status(200).json({
        Spots: currentUsersSpotsArray
    })
})


//Details of a Spot from an id

router.get('/:spotId', requireAuth, async (req, res) => {
    const spotId = await Spot.findByPk(req.params.spotId,
        {
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                },

            ],
            where: {
                id: req.params.id
            }
        })

    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    let num = 0
    let spotJSON = spotId.toJSON()
    spotJSON.numReviews = spotId.Reviews.length;
    for (let review of spotJSON.Reviews) {
        num = num + review.stars
    }
    spotJSON.avgStarRating = num / spotJSON.numReviews
    delete spotJSON.Reviews

    if (spotJSON.SpotImages.length > 1) {
        if (spotJSON.SpotImages[0].id !== spotJSON.SpotImages[1].id) {
            for (let i = 1; i < spotJSON.SpotImages.length; i++) {
                spotJSON.SpotImages[i].preview = false
            }
        }
    }
    // console.log(spotJSON.SpotImages.length)

    res.json(spotJSON)
})

// const numberReviews = await Review.count('spotId')


// const spots = await Spot.findAll({
//     where: { ownerId: req.user.id }
// })

// const owner = await User.findAll({
//     where: { id: spotId.ownerId },
//     attributes: ['id', 'firstName', 'lastName']
// })

// const spotImages = await SpotImage.findAll({
//     where: {
//         spotId: req.params.spotId
//     }
// })

// let spotsArray = []
// for (let spot of spots) {
//     const spotJSON = spot.toJSON()

//     let reviews = await Review.findAll({
//         where: { spotId: spotJSON.id },
//         attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
//     })
//     spotJSON.avgRating = reviews[0].toJSON().avgRating
//     spotsArray.push(spotJSON)
// }

// const returnSpotId = {
//     "id": spotId.id,
//     "ownerId": req.user.id,
//     "address": spotId.address,
//     "city": spotId.city,
//     "state": spotId.state,
//     "country": spotId.country,
//     "lat": spotId.lat,
//     "lng": spotId.lng,
//     "name": spotId.name,
//     "description": spotId.description,
//     "price": spotId.price,
//     "createdAt": spotId.createdAt,
//     "updatedAt": spotId.updatedAt,
//     "numReviews": numberReviews,
//     "avgStarRating": spotsArray[0].avgRating,
//     "spotImages": spotImages,
//     "Owner": owner
// }


//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {

    const spotId = await Spot.findByPk(req.params.spotId)


    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (req.user.id !== spotId.ownerId) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
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
    const spots = await Spot.findByPk(req.params.spotId
        , {
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
        spotId: req.params.spotId,
        review,
        stars,
        createdAt: reviewSpot.createdAt,
        updatedAt: reviewSpot.updatedAt
    })

    res.json(reviews)
})

// get a spots review
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const spotId = await Spot.findByPk(req.params.spotId)

    if (!spotId) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404,
        });
    }

    const allReviews = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
        ],
        where: {
            spotId: spotId.id
        }
    })

    res.json({
        "Reviews": allReviews
    })
})


//get all booking for a spots based on spots Id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    if (spot.ownerId !== req.user.id) {
        spot = await Booking.findAll({
            where: { spotId: req.params.spotId },
            attributes: ['spotId', 'startDate', 'endDate']
        })
    } else {
        spot = await Booking.findAll({
            where: { spotId: req.params.spotId },
            include: { model: User }
        })
        // spot = await Booking.findAll({
        //     where: { userId: req.user.id },
        //     include: { model: Spot }
        // })
    }

    res.json({ "Bookings": spot })
    // const totalBookings = await Booking.findAll({

    //     include: User
    // })

    // console.log("HELLO", totalBookings[0].userId)

    // let bookingsList = []
    // if (totalBookings[0].userId !== req.user.id) {
    //     for (let booking of totalBookings) {
    //         booking.toJSON()
    //         const bookingRes = {
    //             spotId: booking.spotId,
    //             startDate: booking.startDate,
    //             endDate: booking.endDate
    //         }
    //         bookingsList.push(bookingRes)
    //     }
    //     return res.json({
    //         "Bookingsss": bookingsList
    //     })
    // } else {
    //     return res.json({
    //         "Booking": totalBookings,
    //     })
    // }

    // const bookingSpots = {
    //     "User": allUsers[0],
    //     "id": allBookings[0].id,
    //     "spotId": req.params.spotId,
    //     "userId": allBookings[0].userId,
    //     "startDate": allBookings[0].startDate,
    //     "endDate": allBookings[0].endDate,
    //     "createdAt": allBookings[0].createdAt,
    //     "updatedAt": allBookings[0].updatedAt
    // }

    // res.json({ Bookings: [bookingSpots] })
})


//Create a booking based on Spot Id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = await Spot.findByPk(req.params.spotId)

    if (!spotId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (spotId.ownerId === req.user.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    // const bookingErr = {
    //     "message": "Validation Error",
    //     "statusCode": 400,
    //     "errors": {}
    // }

    const { startDate, endDate, createdAt, updatedAt } = req.body

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
        userId: res.user.id,
        startDate,
        endDate,
        createdAt,
        updatedAt

    })

    res.json(postBooking)
})


// delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = await Spot.findByPk(req.params.spotId)
    if (!spotId) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }


    if (req.user.id !== spotId.ownerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await spotId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})




module.exports = router;
