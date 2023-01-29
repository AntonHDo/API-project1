const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot, User } = require('../../db/models');
const Sequelize = require('sequelize')

// get all spotimages
router.get('/', async (req, res) => {
    const spotImage = await SpotImage.findAll()

    res.json(spotImage)
})


//delete spotimage by id
router.delete('/:spotImageId', requireAuth, async (req, res) => {
    const spotImageId = await SpotImage.findByPk(req.params.spotImageId)


    if (!spotImageId) {
        return res.status(404).json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        });
    }

    const spots = await Spot.findOne({
        where: { id: spotImageId.spotId }
    })

    if (req.user.id !== spots.ownerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await spotImageId.destroy({
        where: {
            id: req.params.spotImageId
        }
    })

    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
