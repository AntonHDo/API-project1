const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Username is required'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstname')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastname')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    handleValidationErrors
];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstname, lastname } = req.body;
        const user = await User.signup({ email, username, password, firstname, lastname });

        const token = await setTokenCookie(res, user);
        const returnUser = {
            "id": user.id,
            "firstName": user.firstname,
            "lastName": user.lastname,
            "email": user.email,
            "username": user.username,
            "token": token
        }
        return res.json({
            user: returnUser
        });
    }
);




module.exports = router;
