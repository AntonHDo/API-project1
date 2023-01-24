// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const { requireAuth } = require('../utils/auth')
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

// backend/routes/index.js
router.use('/api', apiRouter, requireAuth);

module.exports = router;
