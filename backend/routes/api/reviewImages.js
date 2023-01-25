const express = require('express');
const router = express.Router();
const { ReviewImage } = require('../../db/models');

router.get('/', async (req, res) => {
    const reviewImage = await ReviewImage.findAll()
    res.json(reviewImage)
})
module.exports = router;
