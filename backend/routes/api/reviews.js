const express = require('express');
const router = express.Router();
const { Review, ReviewImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op, Sequelize } = require("sequelize");

//get reviews from current user
router.get('/current', async (req, res) => {
    const review = await Review.findAll({
        where: {
            userId: req.user.id
        }
    })
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

    if (reviews.userId !== req.user.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    const imageId = await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId
        }
    })

    const reviewAdded = await ReviewImage.count('id')

    if (reviewAdded > 10) {
        res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
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

    if (reviewId.userId !== req.user.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    const { id, userId, spotId, review, stars, createdAt, updatedAt } = req.body

    const reviewErr = {
        message: "Validation Error",
        statusCode: 400,
        errors: {}
    };

    if (stars < 1 || stars > 5) {
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "error": {
                "stars": "Stars must be an integer from 1 to 5"
            }
        })
    }

    if (!review) reviewErr.errors.review = "Review text is required"
    if (!stars) reviewErr.errors.stars = "Stars must be an integer from 1 to 5"

    if (!stars || !review) {
        res.statusCode = 400;
        return res.json(reviewErr)
    }

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
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    if (reviewId.userId !== req.user.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await reviewId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
