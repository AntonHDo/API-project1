const express = require('express');
const router = express.Router();
const { Booking, Spot, User, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { convertDate } = require('../../utils/validation')

//gets all bookings of a current user
router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage
                }
            }
        ],
        where: {
            userId: req.user.id
        }
    })


    let previewArr = []
    for (let review of bookings) {
        previewArr.push(review.toJSON())
    }
    for (let review of previewArr) {
        for (let prevImg of review.Spot.SpotImages) {
            if (prevImg.preview === true) {
                review.Spot.previewImage = prevImg.url
            }
            delete review.Spot.SpotImages
        }
    }


    return res.json({ "Bookings": previewArr })
})



// edit a booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {

    const bookingId = await Booking.findByPk(req.params.bookingId)

    if (!bookingId) {
        return res.status(404).json({
            "message": "Booking Couldn't be found",
            "statusCode": 404
        })
    }


    const bookingErrs = {
        "message": "Validation error",
        "statusCode": 400,
        "errors": {}
    }

    const { id, startDate, endDate, createdAt, updatedAt } = req.body

    if (!startDate) bookingErrs.errors.startDate = "Start date is required"
    if (!endDate) bookingErrs.errors.endDate = "End date is required"
    if (startDate > endDate) bookingErrs.errors.endDate = "endDate cannot come before startDate"

    if (!startDate || !endDate || (startDate > endDate)) {
        return res.status(400).json(bookingErrs)
    }

    if (startDate > endDate) {
        res.status(400);
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
        })
    }

    let now = new Date();
    if (new Date(startDate) < now || new Date(endDate) < now) {
        return res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    // let allBookingDatesForSpot = await Booking.findAll({
    //     where: {
    //         spotId: bookingId.spotId
    //     }
    // })

    // let bookingErr = new Error("Sorry, this spot is already booked for the specified dates")
    // bookingErr.status = 403
    // bookingErr.title = "Booking Conflict"
    // for (let booking of allBookingDatesForSpot) {
    //     if (endDate <= booking.endDate && endDate > booking.startDate) {
    //         { bookingErr.errors = "End date conflicts with an existing booking" }
    //     }
    //     if (startDate >= booking.startDate && startDate < booking.endDate) {
    //         {
    //             bookingErr.errors = "Start date conflicts with an existing booking"
    //         }
    //     }
    //     if (booking.startDate > startDate && booking.endDate < endDate) {
    //         { bookingErr.errors = "Start date conflicts with an existing booking", "End date conflicts with an existing booking" }
    //     }

    // }
    // if (bookingErr.errors) {
    //     return next(bookingErr)
    // }

    const startMiliSec = convertDate(startDate)
    const endMiliSec = convertDate(endDate)

    if (startMiliSec > endMiliSec) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "error": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }

    const bookingStartMiliSec = convertDate(bookingId.startDate)
    const bookingEndMiliSec = convertDate(bookingId.endDate)
    if (bookingStartMiliSec === startMiliSec || bookingEndMiliSec === endMiliSec) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "error": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        })
    }

    if (bookingStartMiliSec >= bookingEndMiliSec) {
        return res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }
    if (bookingId.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403,
        })
    }
    const newBookings = {
        id,
        spotId: bookingId.spotId,
        userId: bookingId.userId,
        startDate,
        endDate,
        createdAt,
        updatedAt
    }

    await bookingId.update(newBookings)

    return res.json(bookingId)
})




// deletes a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = await Booking.findByPk(req.params.bookingId)

    if (!bookingId) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

    let spotId = await Spot.findByPk(bookingId.spotId);


    if (bookingId.userId !== req.user.id || spotId.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    let now = new Date().getTime

    if (new Date(bookingId.startDate).getTime() < now) {
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        })
    }

    await bookingId.destroy({
        where: {
            id: req.params.bookingId
        }
    })
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})
module.exports = router;
