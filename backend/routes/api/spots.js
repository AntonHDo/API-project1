const express = require('express')

const { Spot, SpotImage, Review } = require('../../db/models');
const Sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//tester to see if migration worked
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    let spotsArray = []
    for (let spot of spots) {
        const spotJSON = spot.toJSON()

        let reviews = await Review.findAll({
            where: { spotId: spotJSON.id },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        })
        spotJSON.avgRating = reviews[0].toJSON().avgRating
        spotsArray.push(spotJSON)
    }

    res.json(spotsArray)
})

// post a spot
router.post('/', requireAuth, async (req, res) => {
    // Your code here
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const owner = await Spot.findByPk(req.params.ownerId)
    const spot = await Spot.create({
        ownerId: owner,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.json(spot)
})


//(One-to-Many)
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // Your code here
    const spot = await Spot.findByPk(req.params.spotId)
    const { url, preview } = req.body

    const image = await SpotImage.create({
        url,
        preview,
        spotId: spot.id
    })

    res.json(image)
})


// //get spot of current user
// router.get('/current', requireAuth, (req, res) => {
//     const spot = await Spot.findAll({
//         where{}
//     })
// })

module.exports = router;
