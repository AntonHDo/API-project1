const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { SpotImage, Spot, User } = require('../../db/models');


// get all spotimages
router.get('/', async (req, res) => {
    const spotImage = await SpotImage.findAll()

    res.json(spotImage)
})


//delete spotimage by id
router.delete('/:spotImageId', requireAuth, async (req, res) => {
    const spotImageId = await SpotImage.findByPk(req.params.spotImageId)
    if (!spotImageId) {
        res.status(404).json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    }

    let spotId = await Spot.findByPk(req.user.id.spotId
    )
    console.log("dsfsadddddssssssssssssssssssssdfsd", spotId)
    if (req.user.id !== spotImageId.id) {
        res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await spotImageId.destroy()
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
