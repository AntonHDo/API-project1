const express = require('express');
const router = express.Router();
const { SpotImage } = require('../../db/models');

router.get('/', async (req, res) => {
    const spotImage = await SpotImage.findAll()
    res.json(spotImage)
})

module.exports = router;
