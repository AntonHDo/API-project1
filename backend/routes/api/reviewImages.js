const express = require('express');
const router = express.Router();
const { ReviewImage, Review, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


router.get('/', async (req, res) => {
    const reviewImage = await ReviewImage.findAll()
    res.json(reviewImage)
})


router.delete('/:reviewImageId', requireAuth, async (req, res) => {
    const reviewImageId = await ReviewImage.findByPk(req.params.reviewImageId)
    if (!reviewImageId) {
        return res.status(404).json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    }
    const review = await Review.findOne({
        where: {
            id: reviewImageId.reviewId
        }
    })
    if (req.user.id !== review.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await reviewImageId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})
module.exports = router;
