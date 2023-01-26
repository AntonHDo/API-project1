const express = require('express');
const router = express.Router();
const { Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {
    const booking = await Booking.findAll()
    res.json(booking)
})


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
