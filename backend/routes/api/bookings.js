const express = require('express');
const router = express.Router();
const { Booking } = require('../../db/models');

router.get('/', async (req, res) => {
    const booking = await Booking.findAll()
    res.json(booking)
})
module.exports = router;
