const express = require('express');
const router = express.Router();
const { ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


router.get('/', async (req, res) => {
    const reviewImage = await ReviewImage.findAll()
    res.json(reviewImage)
})


router.delete('/:reviewImageId', requireAuth, async (req, res) => {
    const reviewImageId = await ReviewImage.findByPk(req.params.reviewImageId)
    if (!reviewImageId) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    await reviewImageId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})
module.exports = router;
