const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const spotImagesRouter = require('./spotImages')
const reviewsRouter = require('./reviews')
const bookingsRouter = require('./bookings')
const reviewImagesRouter = require('./reviewImages')
const { restoreUser } = require("../../utils/auth.js");
const { requireAuth } = require('../../utils/auth.js')

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter)

router.use('/reviews', reviewsRouter)

router.use('/bookings', bookingsRouter)

router.use('/review-images', reviewImagesRouter)

router.use('/spot-images', spotImagesRouter)

router.get('/test', requireAuth, (req, res) => {
    res.json({ message: 'success' })
})
// router.post('/test', (req, res) => {
//     res.json({ requestBody: req.body });
// });

module.exports = router;
