const express = require('express');
const router = express.Router();
const { Review, ReviewImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//get reviews from current user
router.get('/current', async (req, res) => {
    const review = await Review.findAll({
        where: {
            userId: req.user.id
        }
    })
    console.log(review)
    res.status(200).json(review)
})


// post reviewimage
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    // Your code here
    const reviews = await Review.findByPk(req.params.reviewId)

    if (!reviews) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    const { url } = req.body

    const image = await ReviewImage.create({
        url
    })
    res.json(image)
})


//edit a review
router.put('/:reviewId', async (req, res) => {
    const reviewId = await Review.findByPk(req.params.reviewId)

    if (!reviewId) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    const { id, userId, spotId, review, stars, createdAt, updatedAt } = req.body

    const newReview = {
        id,
        userId,
        spotId,
        review,
        stars,
        createdAt,
        updatedAt
    }

    await reviewId.update(newReview)

    res.json(reviewId)
})


// delete review by reviewid
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = await Review.findByPk(req.params.reviewId)
    if (!reviewId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    await reviewId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
