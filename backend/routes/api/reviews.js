const express = require('express');
const router = express.Router();
const { Review } = require('../../db/models');

router.get('/current', async (req, res) => {
    const review = await Review.findAll({
        where: {
            userId: req.user.id
        }
    })
    res.status(200).json(review)
})

module.exports = router;
