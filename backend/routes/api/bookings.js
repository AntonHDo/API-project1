const express = require('express');
const router = express.Router();
const { Booking, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize')


//gets all bookings of a current user
router.get('/current', requireAuth, async (req, res) => {
    const booking = await Booking.findAll({
        where: { userId: req.user.id }
    })
    const spot = await Spot.findAll({
        where: {
            ownerId: req.user.id
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

    res.json({ "Booking": [currentUsersBooking] })
})



// edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {

    const bookingId = await Booking.findByPk(req.params.bookingId, {
        where: {
            userId: req.user.id
        }
    })

    if (!bookingId) {
        res.status(404).json({
            "message": "Booking Couldn't be found",
            "statusCode": 404
        })
    }

    const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } = req.body

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
    const bookingId = await Booking.findByPk(req.params.bookingId)
    if (!bookingId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    await bookingId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})
module.exports = router;
