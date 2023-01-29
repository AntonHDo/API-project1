const express = require('express');
const router = express.Router();
const { Booking, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { convertDate } = require('../../utils/validation')

//gets all bookings of a current user
router.get('/current', requireAuth, async (req, res) => {
    const booking = await Booking.findAll({
        where: { userId: req.user.id }
    })
    const spot = await Spot.findAll({
        where: {
            id: booking[0].spotId
        },
        attributes: {
            exclude: ['avgRating', 'createdAt', 'updatedAt', 'description']
        }
    })
    // const user = await User.findAll()

    const currentUsersBooking = {
        "id": booking[0].id,
        "spotId": booking[0].spotId,
        "Spot": spot[0],
        "userId": booking[0].userId,
        "startDate": booking[0].startDate,
        "endDate": booking[0].endDate,
        "createdAt": booking[0].createdAt,
        "updatedAt": booking[0].updatedAt
    }

    res.json({ "Bookings": [currentUsersBooking] })
})



// edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {

    const bookingId = await Booking.findByPk(req.params.bookingId, {
        where: {
            userId: req.user.id
        }
    })

    const spot = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })

    if (!bookingId) {
        res.status(404).json({
            "message": "Booking Couldn't be found",
            "statusCode": 404
        })
    }

    if (bookingId.userId !== req.user.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403,
        })
    }

    const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } = req.body

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

    const bookingStartMiliSec = convertDate(bookingId.startDate)
    const bookingEndMiliSec = convertDate(bookingId.endDate)
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

    if (bookingStartMiliSec >= bookingEndMiliSec) {
        res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    const newBookings = {
        id,
        spotId,
        userId: req.user.id,
        startDate,
        endDate,
        createdAt,
        updatedAt
    }

    await bookingId.update(newBookings)

    res.json(bookingId)
})




// deletes a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = await Booking.findByPk(req.params.bookingId, {
        where: {
            userId: req.user.id
        }
    })


    if (!bookingId) {
        res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }


    let now = new Date()

    if (new Date(bookingId.startDate) <= now) {
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        })
    }

    let spotId = await Spot.findByPk(req.user.id.spotId);

    if (req.user.id !== bookingId.userId || spotId.ownerId !== req.user.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }
    await bookingId.destroy({
        where: {
            id: req.params.bookingId
        }
    })
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})
module.exports = router;
