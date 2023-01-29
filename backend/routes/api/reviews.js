const express = require('express');
const router = express.Router();
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op, Sequelize } = require("sequelize");
const spot = require('../../db/models/spot');

//get reviews from current user
router.get('/current', async (req, res) => {


    const reviews = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
        where: {
            userId: req.user.id
        }
    })

    let previewArr = []
    for (let review of reviews) {
        previewArr.push(review.toJSON())
    }


    for (let review of previewArr) {
        for (let prevImg of review.Spot.SpotImages) {
            if (prevImg.preview === true) {
                review.Spot.previewImage = prevImg.url
            }
            delete review.Spot.SpotImages
        }
    }


    res.status(200).json(previewArr)
})


// post reviewimage
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    // Your code here
    const reviews = await Review.findByPk(req.params.reviewId, {
        include: { model: ReviewImage }
    })

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

    if (reviews.ReviewImages.length >= 10) {
        res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    }

    const { url } = req.body

    const image = await reviews.createReviewImage({
        reviewId: req.params.reviewId,
        url
    })
    res.json({
        id: image.id,
        url: image.url
    })
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
