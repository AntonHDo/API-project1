const express = require('express');
const router = express.Router();
const { Booking, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize')


//gets all bookings of a current user
router.get('/current', async (req, res) => {
    const booking = await Booking.findAll()
    const spot = await Spot.findAll({
        attributes: {
            exclude: ['avgRating', 'createdAt', 'updatedAt']
        }
    })
    const user = await User.findAll()

    const currentUsersBooking = {
        "id": booking[0].id,
        "spotId": booking[0].spotId,
        "Spot": spot[0],
        "userId": req.user.id,
        "startDate": booking[0].startDate,
        "endDate": booking[0].endDate,
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
    }

    res.json({ "Booking": [currentUsersBooking] })
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
