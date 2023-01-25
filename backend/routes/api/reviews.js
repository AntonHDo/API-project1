const express = require('express');
const router = express.Router();
const { Review } = require('../../db/models');

router.get('/', async (req, res) => {
    const review = await Review.findAll()
    res.json(review)
})

module.exports = router;
